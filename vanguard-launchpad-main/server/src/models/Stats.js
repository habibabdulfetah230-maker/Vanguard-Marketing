import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  clients_scaled: {
    type: String,
    default: "150+",
  },
  client_retention: {
    type: String,
    default: "98%",
  },
  leads_generated: {
    type: String,
    default: "5M+",
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Stats = mongoose.models.Stats || mongoose.model('Stats', statsSchema);

export default Stats;
