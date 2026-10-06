import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/auth.js';
import Certification from '../models/Certification.js';

const router = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PNG, JPG are allowed.'));
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
    
    // Auto detect resource type
    let resourceType = 'auto';
    if (mimetype.startsWith('image/')) {
      resourceType = 'image';
    } else {
      resourceType = 'raw'; // for pdf, docs
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio/certificates',
        resource_type: resourceType
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
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    console.error('Error deleting from cloudinary:', err);
  }
};

router.get('/', async (req, res) => {
  try {
    const isAdmin = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer'));
    const query = isAdmin ? {} : { status: 'Published' };
    const certifications = await Certification.find(query).sort({ order: 1, issueDate: -1 });
    res.json({ success: true, data: certifications });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', protect, upload.single('certificateFile'), async (req, res) => {
  try {
    const { name, organization, issueDate, credentialUrl, status, order } = req.body;
    
    let certData = { name, organization, issueDate, credentialUrl, status, order };

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype, req.file.originalname);
      certData.certificateUrl = uploadResult.secure_url;
      certData.certificatePublicId = uploadResult.public_id;
      certData.certificateFileName = req.file.originalname;
      certData.certificateMimeType = req.file.mimetype;
    }

    const cert = await Certification.create(certData);
    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', protect, upload.single('certificateFile'), async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Not found' });

    const { name, organization, issueDate, credentialUrl, status, order } = req.body;
    let updateData = { name, organization, issueDate, credentialUrl, status, order };

    if (req.file) {
      // Upload new file
      const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype, req.file.originalname);
      updateData.certificateUrl = uploadResult.secure_url;
      updateData.certificatePublicId = uploadResult.public_id;
      updateData.certificateFileName = req.file.originalname;
      updateData.certificateMimeType = req.file.mimetype;

      // Delete old file if exists
      if (cert.certificatePublicId) {
        await deleteFromCloudinary(cert.certificatePublicId);
      }
    }

    const updatedCert = await Certification.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: updatedCert });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Not found' });

    if (cert.certificatePublicId) {
      await deleteFromCloudinary(cert.certificatePublicId);
    }

    await cert.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
