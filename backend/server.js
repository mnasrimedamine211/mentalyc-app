const express = require('express');
const app = express();
const port = 3006;

const fs = require('fs');
const multer = require('multer');
const path = require('path');


const uploadDirectory = './uploads';

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

// Set up a route for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    try {
      // If you reach this point, the file upload was successful
      res.json({ message: 'File uploaded successfully!' });
    } catch (error) {
  
      res.status(500).json({ error: 'Error uploading file' });
    }
  });
  
// New route to get the list of uploaded videos
app.get('/videos', (req, res) => {
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading upload directory' });
        }

        const videoList = files.filter(file => file.endsWith('.mp4')); // Adjust the filter based on your video file extensions
        res.json({ videos: videoList });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
