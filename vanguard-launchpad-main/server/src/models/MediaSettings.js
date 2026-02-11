import mongoose from "mongoose";

const mediaSettingsSchema = new mongoose.Schema({
  enable_media: {
    type: Boolean,
    default: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Ensure only one settings document exists
mediaSettingsSchema.pre('save', async function() {
  const count = await this.constructor.countDocuments();
  if (count > 0) {
    throw new Error('Only one media settings document can exist');
  }
});

const MediaSettings = mongoose.models.MediaSettings || mongoose.model('MediaSettings', mediaSettingsSchema);

export default MediaSettings;
