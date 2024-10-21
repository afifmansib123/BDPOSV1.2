const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

router.get('/cloudinary-sign', (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_SECRET
  );

  res.status(200).json({ signature, timestamp });
});

module.exports = router;