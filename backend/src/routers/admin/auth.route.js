import { Router } from "express";
import { Signup, Login, forgetPassword, updateProfile, getMyProfile, signupOtp, forgetPasswordOtp,Signout} from "../../controllers/admin/auth.controllers.js";
import { duplicateEmail } from "../../middlewares/duplicateEmail.middleware.js";
import { adminPresent } from "../../middlewares/emailIsPresent.middleware.js";
import { requiredLogin } from "../../middlewares/requiredLogin.midddleware.js";
import { verifyOTP } from "../../controllers/admin/auth.controllers.js";
import multer from "multer"

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true); // allow all image types
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    }
});

router.post("/signup", Signup);
router.post("/login", adminPresent, Login);
// router.patch('/forgetpassword', forgetPassword);
//router.put('/updateProfile', requiredLogin, upload.single("profileImage"), updateProfile);
router.put('/updateProfile', requiredLogin, upload.single("profileImage"),updateProfile);
router.get("/myprofile",requiredLogin, getMyProfile);
router.post('/signupOtp', duplicateEmail, signupOtp);
//router.post("/forgetpassword", adminPresent, forgetPasswordOtp);


// Forget Password routes
router.post("/forgetpasswordOtp", adminPresent, forgetPasswordOtp);  
router.post("/verifyOtp", verifyOTP);                                 
router.post('/forgetpassword', forgetPassword);                      

router.post("/signout",Signout);

export default router