import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import requireAdmin from "../../middleware/requireAdmin.js";
import validateRequest from "../../middleware/validateRequest.js";
import storage from "../../config/storage.js";
import {
  createFullProjectController,
  listFullProjectsController,
  updateFullProjectController,
  deleteFullProjectController,
  clearAllFullProjectsController,
} from "./fullProject.controller.js";
import { createFullProjectSchema } from "./fullProject.validation.js";

const upload = storage.single("image");

const router = Router();

router.get("/", listFullProjectsController);
router.post("/", authMiddleware, requireAdmin, upload, validateRequest(createFullProjectSchema), createFullProjectController);
router.patch("/:id", authMiddleware, requireAdmin, upload, validateRequest(createFullProjectSchema), updateFullProjectController);
router.delete("/:id", authMiddleware, requireAdmin, deleteFullProjectController);
router.delete("/", authMiddleware, requireAdmin, clearAllFullProjectsController);

export default router;
