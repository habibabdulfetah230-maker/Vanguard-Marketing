import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import requireAdmin from "../../middleware/requireAdmin.js";
import validateRequest from "../../middleware/validateRequest.js";
import {
  submitContactController,
  listContactSubmissionsController,
  markAsReadController,
  deleteContactSubmissionController,
  clearAllContactSubmissionsController,
} from "./contact.controller.js";
import { submitContactSchema } from "./contact.validation.js";

const router = Router();

// Public endpoint for submitting contact form
router.post("/", validateRequest(submitContactSchema), submitContactController);

// Admin endpoints
router.get("/", authMiddleware, requireAdmin, listContactSubmissionsController);
router.patch("/:id/read", authMiddleware, requireAdmin, markAsReadController);
router.delete("/:id", authMiddleware, requireAdmin, deleteContactSubmissionController);
router.delete("/clear", authMiddleware, requireAdmin, clearAllContactSubmissionsController);

export default router;
