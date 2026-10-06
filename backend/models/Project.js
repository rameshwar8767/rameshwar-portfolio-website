import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  category: { type: String },
  imageUrl: { type: String },
  imagePublicId: { type: String },
  githubUrl: { 
    type: String, 
    required: [true, 'GitHub URL is required'],
    match: [/^https?:\/\/(www\.)?github\.com\/.+/i, 'Please enter a valid GitHub URL (https://github.com/...)']
  },
  liveUrl: { 
    type: String,
    match: [/^https?:\/\/.+/i, 'Please enter a valid URL starting with http:// or https://']
  },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Draft', 'Published', 'Archived'], default: 'Draft' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
