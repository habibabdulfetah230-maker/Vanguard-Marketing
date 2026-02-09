import { Router } from "express";
import validateRequest from "../../middleware/validateRequest.js";
import { loginSchema } from "./auth.validation.js";
import { loginAdminController } from "./auth.controller.js";
import { resetAdmin } from "./auth.service.js";

const router = Router();

router.post("/login", validateRequest(loginSchema), loginAdminController);

// Reset admin endpoint (for setup purposes)
router.post("/reset-admin", async (req, res) => {
  try {
    const credentials = await resetAdmin();
    res.json({ 
      message: "Admin reset successfully", 
      credentials 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
