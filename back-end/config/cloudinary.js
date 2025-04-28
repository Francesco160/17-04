const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'EPICODE', // nome cartella su Cloudinary
    allowed_formats: ['jpg', 'png'],
    transformation: [{ width: 300, height: 300, crop: 'limit' }]
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
