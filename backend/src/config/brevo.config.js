import SibApiV3Sdk from "sib-api-v3-sdk";

export const brevo = async (emailData) => {
  const client = SibApiV3Sdk.ApiClient.instance;

  client.authentications["api-key"].apiKey =
    process.env.BREVO_API_KEY;

  const apiInstance =
    new SibApiV3Sdk.TransactionalEmailsApi();

  try {
    const response =
      await apiInstance.sendTransacEmail(emailData);

    return response;

  } catch (error) {
    console.error(
      "Brevo Error:",
      error.response?.body || error.message
    );
    throw error; // 🔥 Important: throw error
  }
};