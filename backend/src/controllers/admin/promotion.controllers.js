import { brevo } from "../../config/brevo.config.js";
import promotionModel from "../../models/admin/promotion.models.js";
import { createPromotionEmail } from "../../utils/promotionEmail.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

const sendPromotion = async (req, res) => {
    try {
        const { subject, offerTitle, offerDescription } = req.body;

        if (!subject || !offerTitle || !offerDescription) {
            return res.status(400).json(
                new ApiError(400, "All fields are required")
            );
        }

        const subscribers = await promotionModel
            .find({})
            .select("email");

        if (subscribers.length === 0) {
            return res.status(404).json(
                new ApiError(404, "No Subscribers Found")
            );
        }

        const htmlContent = createPromotionEmail(
            offerTitle,
            offerDescription
        );

        const batchSize = 50;

        const successEmails = [];
        const failedEmails = [];

        for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize);

            await Promise.all(
                batch.map(async (subscriber) => {
                    try {
                        const response = await brevo({
                            sender: {
                                name: process.env.companyName,
                                email: process.env.companyEmail,
                            },
                            to: [
                                {
                                    email: subscriber.email,
                                },
                            ],
                            subject: subject,
                            htmlContent: htmlContent,
                        });

                        successEmails.push({
                            email: subscriber.email,
                            messageId: response?.messageId || null,
                        });

                    } catch (error) {
                        failedEmails.push({
                            email: subscriber.email,
                            error:
                                error.response?.body?.message ||
                                error.message,
                        });
                    }
                })
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    totalSubscribers: subscribers.length,
                    successCount: successEmails.length,
                    failedCount: failedEmails.length,
                    failedEmails,
                },
                "Promotion sending completed"
            )
        );

    } catch (error) {
        return res.status(500).json(
            new ApiError(
                500,
                error.message,
                [{ message: error.message, name: error.name }]
            )
        );
    }
};

export { sendPromotion };