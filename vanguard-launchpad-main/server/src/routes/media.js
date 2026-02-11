import express from "express";
import path from "path";
import fs from "fs/promises";
import MediaSettings from "../models/MediaSettings.js";
import MediaItem from "../models/MediaItem.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Get media settings
router.get("/settings", async (req, res, next) => {
  try {
    let settings = await MediaSettings.findOne();
    if (!settings) {
      settings = await MediaSettings.create({ enable_media: true });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// Update media settings
router.put("/settings", authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const { enable_media } = req.body;
    
    let settings = await MediaSettings.findOne();
    if (!settings) {
      settings = await MediaSettings.create({ enable_media });
    } else {
      settings.enable_media = enable_media;
      settings.updated_at = new Date();
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// Get all media items
router.get("/items", async (req, res, next) => {
  try {
    const mediaItems = await MediaItem.find().sort({ created_at: -1 });
    res.json(mediaItems);
  } catch (error) {
    next(error);
  }
});

// Upload media
router.post("/upload", authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { assigned_pages = [] } = req.body;
    const pagesArray = Array.isArray(assigned_pages) ? assigned_pages : [assigned_pages];

    const mediaItem = new MediaItem({
      filename: req.file.filename,
      original_name: req.file.originalname,
      file_path: `/uploads/media/${req.file.filename}`,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      media_type: req.file.mimetype.startsWith('video/') ? 'video' : 'image',
      assigned_pages: pagesArray,
    });

    await mediaItem.save();
    res.status(201).json(mediaItem);
  } catch (error) {
    next(error);
  }
});

// Update media item
router.put("/items/:id", authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const { assigned_pages, is_enabled } = req.body;
    
    const mediaItem = await MediaItem.findByIdAndUpdate(
      req.params.id,
      { 
        assigned_pages: Array.isArray(assigned_pages) ? assigned_pages : [assigned_pages],
        is_enabled,
        updated_at: new Date()
      },
      { new: true }
    );
    
    if (!mediaItem) {
      return res.status(404).json({ message: "Media item not found" });
    }
    
    res.json(mediaItem);
  } catch (error) {
    next(error);
  }
});

// Delete media item
router.delete("/items/:id", authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const mediaItem = await MediaItem.findByIdAndDelete(req.params.id);
    
    if (!mediaItem) {
      return res.status(404).json({ message: "Media item not found" });
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(process.cwd(), mediaItem.file_path);
      await fs.unlink(filePath);
    } catch (fileError) {
      console.warn("Failed to delete file:", fileError);
    }
    
    res.json({ message: "Media item deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
