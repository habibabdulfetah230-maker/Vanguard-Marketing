import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import requireAdmin from "../../middleware/requireAdmin.js";
import validateRequest from "../../middleware/validateRequest.js";
import storage from "../../config/storage.js";
import { createTestimonialController, listTestimonialsController, updateTestimonialController, deleteTestimonialController } from "./testimonial.controller.js";
import { createTestimonialSchema } from "./testimonial.validation.js";

const upload = storage.single("photo");

const router = Router();

router.get("/", listTestimonialsController);
router.post("/", authMiddleware, requireAdmin, upload, validateRequest(createTestimonialSchema), createTestimonialController);
router.patch("/:id", authMiddleware, requireAdmin, upload, validateRequest(createTestimonialSchema), updateTestimonialController);
router.delete("/:id", authMiddleware, requireAdmin, deleteTestimonialController);

export default router;
