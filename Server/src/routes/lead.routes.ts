import { Router } from "express";
import { asyncHandler } from "../error/error.handller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { leadController } from "../controllers/lead.controller";

const router = Router();

router.post(
  "/add-lead",
  authMiddleware,
  asyncHandler(leadController.createLead)
);

router.get(
  "/get-leads",
  authMiddleware,
  asyncHandler(leadController.getLeads)
);


router.put(
  "/:id",
  authMiddleware,
  asyncHandler(leadController.updateLead)
);

router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(leadController.deleteLead)
);


export default router;
