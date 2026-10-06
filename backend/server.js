import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import experienceRoutes from './routes/experience.js';
import educationRoutes from './routes/education.js';
import certificationsRoutes from './routes/certifications.js';
import skillsRoutes from './routes/skills.js';
import profileRoutes from './routes/profile.js';
import contactRoutes from './routes/contact.js';
import mediaRoutes from './routes/media.js';

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    process.env.FRONTEND_URL // Vercel: Set this in backend environment variables to your frontend URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectsRoutes);
app.use('/api/v1/experience', experienceRoutes);
app.use('/api/v1/education', educationRoutes);
app.use('/api/v1/certifications', certificationsRoutes);
app.use('/api/v1/skills', skillsRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/contact', contactRoutes); // This overrides the old /api/contact logic
app.use('/api/v1/media', mediaRoutes);

// Default Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Portfolio API! 🚀' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Only listen if not deployed on Vercel, as Vercel handles the server execution
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Export the app for Vercel Serverless Functions
export default app;
