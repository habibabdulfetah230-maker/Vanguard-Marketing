import express from "express";
import Stats from "../models/Stats.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Get stats
router.get("/", async (req, res, next) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) {
      stats = await Stats.create({});
    }
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Update stats
router.put("/", authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const { clients_scaled, client_retention, leads_generated } = req.body;
    
    let stats = await Stats.findOne();
    if (!stats) {
      stats = await Stats.create({});
    }
    
    if (clients_scaled !== undefined) stats.clients_scaled = clients_scaled;
    if (client_retention !== undefined) stats.client_retention = client_retention;
    if (leads_generated !== undefined) stats.leads_generated = leads_generated;
    
    stats.updated_at = new Date();
    await stats.save();
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;
