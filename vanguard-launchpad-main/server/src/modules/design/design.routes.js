import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import requireAdmin from "../../middleware/requireAdmin.js";
import validateRequest from "../../middleware/validateRequest.js";
import storage from "../../config/storage.js";
import { createDesignController, listDesignController, updateDesignController, deleteDesignController } from "./design.controller.js";
import { createDesignSchema } from "./design.validation.js";

const upload = storage.single("image");

const router = Router();

router.get("/", listDesignController);
router.post("/", authMiddleware, requireAdmin, upload, validateRequest(createDesignSchema), createDesignController);
router.patch("/:id", authMiddleware, requireAdmin, upload, validateRequest(createDesignSchema), updateDesignController);
router.delete("/:id", authMiddleware, requireAdmin, deleteDesignController);

export default router;
