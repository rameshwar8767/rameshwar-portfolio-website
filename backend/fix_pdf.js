import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Profile from './models/Profile.js';

dotenv.config({ override: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  const profile = await Profile.findOne();
  if (!profile || !profile.resumeUrl) {
    console.log("No profile or resumeUrl found.");
    process.exit(0);
  }

  console.log("Current URL:", profile.resumeUrl);

  if (profile.resumeUrl.includes('/image/upload/')) {
    console.log("Found /image/upload/ in URL. Re-uploading as raw...");
    
    // Cloudinary might block GET request to the PDF if it's 401, but wait, 401 is only for browser?
    // Let's try to just upload it as raw if we can fetch it, OR we can just instruct Cloudinary to rename/change resource_type?
    // You cannot change resource_type of an existing asset directly.
    // Let's try downloading it. If it fails due to 401, we might need to use fl_attachment in the URL to download it.
    let fetchUrl = profile.resumeUrl.replace('/image/upload/', '/image/upload/fl_attachment/');
    const res = await fetch(fetchUrl);
    
    if (!res.ok) {
       console.log("Failed to download PDF from Cloudinary:", res.status, res.statusText);
       process.exit(1);
    }
    
    const buffer = Buffer.from(await res.arrayBuffer());
    
    console.log("Downloaded buffer length:", buffer.length);
    
    const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'portfolio/profile', resource_type: 'raw', use_filename: true, unique_filename: true },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
    
    console.log("New upload result:", uploadResult.secure_url);
    
    profile.resumeUrl = uploadResult.secure_url;
    profile.resumePublicId = uploadResult.public_id;
    await profile.save();
    
    console.log("Profile updated successfully!");
  } else {
    console.log("URL does not contain /image/upload/. It looks fine.");
  }
  
  process.exit(0);
}

fix();
