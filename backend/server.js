import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

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

// ==========================================
// SECURITY MIDDLEWARES
// ==========================================
// 1. Set secure HTTP headers
app.use(helmet({ crossOriginResourcePolicy: false })); // Disabled CORP slightly for easier image loading if needed

// 2. Data sanitization against NoSQL query injection
// Disabled because express-mongo-sanitize is incompatible with Express 5 (req.query is read-only)
// app.use(mongoSanitize());

// 3. Rate Limiting to prevent brute-force & DDoS attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 minutes
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', apiLimiter);

// ==========================================
// STANDARD MIDDLEWARE
// ==========================================
app.use(cors({
  origin: function (origin, callback) {
    // Allow localhost, any explicitly set FRONTEND_URL, or any Vercel preview/production deployment
    const allowed = 'http://localhost:5173';
    if (!origin || origin === allowed || origin === process.env.FRONTEND_URL || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
