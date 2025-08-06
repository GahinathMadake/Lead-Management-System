import { Router } from "express";
import { asyncHandler } from "../error/error.handller";
const { authController } = require('../controllers/auth.controller');

const router = Router();

router.get('/login',
    asyncHandler(authController.login)
);

export default router;