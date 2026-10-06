import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String },
  responsibilities: [{ type: String }],
  technologies: [{ type: String }],
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Published' }
}, { timestamps: true });

export default mongoose.model('Experience', experienceSchema);
