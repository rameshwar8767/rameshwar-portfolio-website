import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  about: { type: String },
  email: { type: String },
  github: { type: String },
  linkedin: { type: String },
  resumeUrl: { type: String },
  resumePublicId: { type: String },
  profileImageUrl: { type: String },
  profileImagePublicId: { type: String }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
