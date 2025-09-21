import { Router } from "express";
import { asyncHandler } from "../error/error.handller";
import { authMiddleware } from "../middlewares/auth.middleware";
const { userController } = require( '../controllers/user.controller');

const router = Router();

router.get('/me',
    authMiddleware,
    asyncHandler(userController.getUser)
);

router.post('/logout',
    authMiddleware,
    asyncHandler(userController.logout)
);

export default router;