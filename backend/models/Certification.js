import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String, required: true },
  issueDate: { type: String },
  credentialUrl: { type: String },
  certificateUrl: { type: String },
  certificatePublicId: { type: String },
  certificateFileName: { type: String },
  certificateMimeType: { type: String },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Published' }
}, { timestamps: true });

export default mongoose.model('Certification', certificationSchema);
