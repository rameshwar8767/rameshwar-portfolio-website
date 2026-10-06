import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/auth.js';
import Project from '../models/Project.js';

const router = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PNG, JPG, JPEG, WEBP are allowed.'));
    }
  }
});

// Configure Cloudinary
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};

const uploadToCloudinary = (buffer, mimetype, originalname) => {
  return new Promise((resolve, reject) => {
    configureCloudinary();
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio/projects',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  configureCloudinary();
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    console.error('Error deleting from cloudinary:', err);
  }
};

router.get('/', async (req, res) => {
  try {
    const isAdmin = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer'));
    const query = isAdmin ? {} : { status: 'Published' };
    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', protect, upload.single('imageFile'), async (req, res) => {
  try {
    let projectData = { ...req.body };

    // Process technologies string to array if needed (handled by frontend, but good to ensure)
    if (typeof projectData.technologies === 'string') {
        try {
            projectData.technologies = JSON.parse(projectData.technologies);
        } catch(e) {
            // fallback if it wasn't stringified JSON
            projectData.technologies = projectData.technologies.split(',').map(t => t.trim()).filter(Boolean);
        }
    }

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype, req.file.originalname);
      projectData.imageUrl = uploadResult.secure_url;
      projectData.imagePublicId = uploadResult.public_id;
    }

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', protect, upload.single('imageFile'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    let updateData = { ...req.body };
    
    if (typeof updateData.technologies === 'string') {
        try {
            updateData.technologies = JSON.parse(updateData.technologies);
        } catch(e) {
            updateData.technologies = updateData.technologies.split(',').map(t => t.trim()).filter(Boolean);
        }
    }

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype, req.file.originalname);
      updateData.imageUrl = uploadResult.secure_url;
      updateData.imagePublicId = uploadResult.public_id;

      if (project.imagePublicId) {
        await deleteFromCloudinary(project.imagePublicId);
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    res.json({ success: true, data: updatedProject });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.imagePublicId) {
      await deleteFromCloudinary(project.imagePublicId);
    }

    await project.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
