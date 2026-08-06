const cloudinary = require('../config/cloudinary');

// Wraps Cloudinary's upload_stream in a Promise so we can await it.
// folder param lets us separate avatars vs article covers in Cloudinary's dashboard.
const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `wonderfool/${folder}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

// POST /api/upload/:type   (type = 'avatar' | 'cover')
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { type } = req.params;
    const allowedTypes = ['avatar', 'cover'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid upload type. Use "avatar" or "cover".' });
    }

    const folder = `${type}/${req.mongoUser._id}`;
    const result = await streamUpload(req.file.buffer, folder);

    res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
};

module.exports = { uploadImage };