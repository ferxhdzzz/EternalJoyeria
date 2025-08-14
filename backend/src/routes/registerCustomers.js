import express from "express";
import multer from "multer";
import registerCustomersController from "../controllers/registerCustomersController.js";

const router = express.Router();
const upload = multer({ dest: "public/" });

router.post("/", upload.single("profilePicture"), registerCustomersController.registerClient);
router.post("/verifyCodeEmail", registerCustomersController.verifyCodeEmail);
//  reenviar codigo
router.post("/resend-code", registerCustomersController.resendVerificationCode);

export default router;