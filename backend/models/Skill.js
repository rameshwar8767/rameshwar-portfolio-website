import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String }, // Can store a string representing the icon name (e.g., from lucide-react or simple-icons)
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Published' }
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
