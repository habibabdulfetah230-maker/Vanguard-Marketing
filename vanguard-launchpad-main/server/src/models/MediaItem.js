import mongoose from "mongoose";

const mediaItemSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  original_name: {
    type: String,
    required: true,
  },
  file_path: {
    type: String,
    required: true,
  },
  file_size: {
    type: Number,
    required: true,
  },
  mime_type: {
    type: String,
    required: true,
  },
  media_type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  assigned_pages: [{
    type: String,
    enum: ['home', 'services', 'portfolio'],
  }],
  is_enabled: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const MediaItem = mongoose.models.MediaItem || mongoose.model('MediaItem', mediaItemSchema);

export default MediaItem;
