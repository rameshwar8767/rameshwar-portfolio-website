import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  grade: { type: String },
  description: { type: String },
  institutionUrl: { type: String },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Published' }
}, { timestamps: true });

export default mongoose.model('Education', educationSchema);
