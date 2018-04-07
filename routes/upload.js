const ipfsAPI = require('ipfs-api');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

var express = require('express');
var router = express.Router();

const MAX_SIZE = 52428800;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
  },
});

const upload = multer({ storage });

const ipfs = ipfsAPI({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http'
});

/*  upload POST endpoint */
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(422).json({
      error: 'File needs to be provided.',
    });
  }

  const mime = req.file.mimetype;
  if (mime.split('/')[0] !== 'image') {
    fs.unlink(req.file.path);

    return res.status(422).json({
      error: 'File needs to be an image.',
    });
  }

  const fileSize = req.file.size;
  if (fileSize > MAX_SIZE) {
    fs.unlink(req.file.path);

    return res.status(422).json({
      error: `Image needs to be smaller than ${MAX_SIZE} bytes.`,
    });
  }

  const data = fs.readFileSync(req.file.path);
  return ipfs.add(data, (err, files) => {
    fs.unlink(req.file.path);
    if (files) {
      return res.json({
        hash: files[0].hash,
      });
    }

    return res.status(500).json({
      error: err,
    });
  });
});

/*  upload GET endpoint. */
router.get('/', function(req, res, next) {
  res.send('Upload endpoint!');
});

module.exports = router;
