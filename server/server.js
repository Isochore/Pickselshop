const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const sharp = require('sharp');

// Only allow image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload an image file'), false);
    }
}

// Destination directory
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage, fileFilter });

// Serve static files from the 'uploads' directory
const uploadsPath = path.join(__dirname, 'uploads');

app.use(express.static(uploadsPath));

app.use(cors());
app.use(bodyParser.json());

// Upload an image
app.post('/upload', upload.single('image'), (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error('Please upload a file');
      error.status = 400;
      return next(error);
    }
    res.status(200).send('File uploaded successfully');
});

// Get the image list
app.get('/images', (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');
    fs.readdir(directoryPath, (err, files) => {
    if (err) {
    return res.status(500).send({ error: 'Error reading directory' });
    }
  
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(file));
  
      res.send({ images: imageFiles });
    });
  });

  
  
  // Update the file name
  app.put('/upload/:filename', (req, res, next) => {
    const oldFilename = req.params.filename;
    const newFilename = req.body.newFilename;
  
    fs.rename(`uploads/${oldFilename}`, `uploads/${newFilename}.${oldFilename.split('.').pop()}`, (err) => {
        if (err) {
          console.error(err);
          const error = new Error('Failed to update filename');
          error.status = 500;
          return next(error);
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send('Filename updated successfully');
      });
  });

  
  try {
    app.listen(5001, () => {
      console.log("Server is running on port 5001");
    });
  } catch (error) {
    console.error(`Error starting server: ${error}`);
  }

  // Apply black and white filter

  app.post('/black-white/:filename', (req, res, next) => {
    const filename = req.params.filename;
    const inputImagePath = `uploads/${filename}`;
  
    fs.access(inputImagePath, fs.constants.F_OK, (error) => {
      if (error) {
        const error = new Error('Image not found');
        error.status = 404;
        return next(error);
      }
  
      const tempOutputImagePath = `uploads/${filename}-temp`; // Temporary output file path
  
      // Apply black and white filter to the image and save as a temporary file
      sharp(inputImagePath)
        .grayscale()
        .toFile(tempOutputImagePath, (error) => {
          if (error) {
            return next(error);
          }
  
          // Replace the original file with the processed file
          fs.rename(tempOutputImagePath, inputImagePath, (error) => {
            if (error) {
              return next(error);
            }
  
            res.status(200).send('Black and white filter applied successfully');
          });
        });
    });
  });