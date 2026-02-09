import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import requireAdmin from "../../middleware/requireAdmin.js";
import validateRequest from "../../middleware/validateRequest.js";
import storage from "../../config/storage.js";
import {
  createBrandingItemController,
  listBrandingItemsController,
  updateBrandingItemController,
  deleteBrandingItemController,
  clearAllBrandingController,
} from "./branding.controller.js";
import { createBrandingSchema } from "./branding.validation.js";

const upload = storage.single("image");

const router = Router();

router.get("/", listBrandingItemsController);
router.post("/", authMiddleware, requireAdmin, upload, validateRequest(createBrandingSchema), createBrandingItemController);
router.patch("/:id", authMiddleware, requireAdmin, upload, validateRequest(createBrandingSchema), updateBrandingItemController);
router.delete("/:id", authMiddleware, requireAdmin, deleteBrandingItemController);
router.delete("/", authMiddleware, requireAdmin, clearAllBrandingController);

export default router;
