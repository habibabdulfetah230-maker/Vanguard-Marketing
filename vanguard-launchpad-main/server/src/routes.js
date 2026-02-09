import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";
import { adminVideoRouter, publicVideoRouter } from "./modules/video/video.routes.js";
import brandingRoutes from "./modules/branding/branding.routes.js";
import fullProjectRoutes from "./modules/fullProject/fullProject.routes.js";
import designRoutes from "./modules/design/design.routes.js";
import testimonialRoutes from "./modules/testimonial/testimonial.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/contact", contactRoutes);
router.use("/videos", publicVideoRouter);
router.use("/admin/videos", adminVideoRouter);
router.use("/branding", brandingRoutes);
router.use("/full-projects", fullProjectRoutes);
router.use("/design", designRoutes);
router.use("/testimonials", testimonialRoutes);

export default router;
