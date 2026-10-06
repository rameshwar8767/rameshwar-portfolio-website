import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/auth.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/webp',
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PNG, JPG, JPEG, WEBP, PDF, DOC, DOCX are allowed.'));
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
    
    let resource_type = 'image';
    if (mimetype === 'application/pdf' || mimetype.includes('word') || mimetype.includes('document')) {
        resource_type = 'raw';
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio/profile',
        resource_type: resource_type,
        use_filename: true,
        unique_filename: true
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
    // We don't know the exact resource type here easily, try both if necessary, or just 'image' then 'raw'
    // But mostly we just try 'image' first, if it fails, try 'raw'
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    } catch(e) {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }
  } catch (err) {
    console.error('Error deleting from cloudinary:', err);
  }
};

router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({ name: 'Admin', title: 'Developer' });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const profileUploads = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resumeFile', maxCount: 1 }
]);

router.put('/', protect, profileUploads, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    let updateData = { ...req.body };

    // Handle Profile Image Upload
    if (req.files && req.files['profileImage']) {
      const file = req.files['profileImage'][0];
      const uploadResult = await uploadToCloudinary(file.buffer, file.mimetype, file.originalname);
      updateData.profileImageUrl = uploadResult.secure_url;
      updateData.profileImagePublicId = uploadResult.public_id;
      
      // Delete old profile image if it exists
      if (profile && profile.profileImagePublicId) {
        await deleteFromCloudinary(profile.profileImagePublicId);
      }
    }

    // Handle Resume Upload
    if (req.files && req.files['resumeFile']) {
      const file = req.files['resumeFile'][0];
      const uploadResult = await uploadToCloudinary(file.buffer, file.mimetype, file.originalname);
      updateData.resumeUrl = uploadResult.secure_url;
      updateData.resumePublicId = uploadResult.public_id;
      
      // Delete old resume if it exists
      if (profile && profile.resumePublicId) {
        await deleteFromCloudinary(profile.resumePublicId);
      }
    }

    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, updateData, { new: true, runValidators: true });
    } else {
      profile = await Profile.create(updateData);
    }
    
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
