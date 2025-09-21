import { Router } from "express";
import { asyncHandler } from "../error/error.handller";
const { authController } = require('../controllers/auth.controller');

const router = Router();

router.post('/send-otp',
    asyncHandler(authController.sentOTP)
);

router.post('/create-user',
    asyncHandler(authController.Register)
);

router.post('/login',
    asyncHandler(authController.login)
);

router.post('/forgot-password',
    asyncHandler(authController.forgotPassword)
);

router.post('/reset-password',
    asyncHandler(authController.resetPassword)
);

export default router;