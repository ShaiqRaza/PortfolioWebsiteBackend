import upload from "../config/multerConfig.js";

// Multer's setup for handling video and image files
const uploadVideo = upload.single('video');  // For single file upload
const uploadImages = upload.array('images'); // For multiple file upload

// Optional middleware for image upload
export const imagesUploadOptional = (req, res, next) => {
  if (req.body.images) {
    return uploadImages(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading images", error: err.message });
      }
      next(); // Proceed if images are uploaded successfully
    });
  }
  next(); // If no images, skip and move to the next handler
};

// Optional middleware for video upload
export const videoUploadOptional = (req, res, next) => {
  if (req.body.video) {
    return uploadVideo(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading video", error: err.message });
      }
      next(); // Proceed if video is uploaded successfully
    });
  }
  next(); // If no video, skip and move to the next handler
};
