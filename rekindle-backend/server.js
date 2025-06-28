require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const Details = require('./models/Details');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/details', upload.any(), async (req, res) => {
  console.log('Details body:', req.body);
  console.log('Details files:', req.files);
  try {
    const { patientName, patientAbout, patientDisease, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Parse guardians from FormData
    let guardians = req.body.guardians;
    if (typeof guardians === 'string') {
      guardians = JSON.parse(guardians);
    }
    
    // Attach photos to guardians
    if (Array.isArray(guardians)) {
      guardians = guardians.map((guardian, i) => {
        let photoFile = null;
        if (req.files) {
          photoFile = req.files.find(f => f.fieldname === `guardians[${i}][photo]`);
        }
        const photo = photoFile ? { data: photoFile.buffer, contentType: photoFile.mimetype } : undefined;
        return { ...guardian, photo };
      });
    }
    
    // Find family photo
    let familyPhotoFile = null;
    if (req.files) {
      familyPhotoFile = req.files.find(f => f.fieldname === 'familyPhoto');
    }
    const familyPhoto = familyPhotoFile ? { data: familyPhotoFile.buffer, contentType: familyPhotoFile.mimetype } : undefined;
    
    const details = new Details({ userId, patientName, patientAbout, patientDisease, familyPhoto, guardians });
    await details.save();
    
    console.log('Details saved successfully for user:', userId);
    res.status(201).json({ message: 'Details saved!' });
  } catch (err) {
    console.error('Details save error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/signup', async (req, res) => {
  console.log('Signup body:', req.body); // Debug print
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();
    
    console.log('User created successfully:', user._id);
    res.json({ success: true, userId: user._id });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1d' }
    );
    
    console.log('Login successful for user:', user._id);
    res.json({ success: true, token, userId: user._id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/family-photo', async (req, res) => {
  try {
    let userId;
    
    // Check if user is authenticated
    const auth = req.headers.authorization;
    if (auth) {
      try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        userId = decoded.userId;
        console.log('Family photo request for authenticated user:', userId);
      } catch (err) {
        console.log('Invalid token, checking query parameter');
      }
    }
    
    // If no authenticated user, check for userId in query parameter
    if (!userId && req.query.userId) {
      userId = req.query.userId;
      console.log('Family photo request for user ID from query:', userId);
    }
    
    if (!userId) {
      return res.status(401).json({ error: 'No user ID provided' });
    }
    
    // Find Details for the user
    const details = await Details.findOne({ 
      userId: userId, 
      familyPhoto: { $exists: true, $ne: null } 
    }).sort({ _id: -1 });
    
    console.log('Found details:', details ? 'Yes' : 'No');
    console.log('Details userId:', details ? details.userId : 'N/A');
    console.log('Requested userId:', userId);
    
    if (details && details.familyPhoto && details.familyPhoto.data) {
      console.log('Sending family photo, size:', details.familyPhoto.data.length, 'bytes');
      res.set('Content-Type', details.familyPhoto.contentType || 'image/jpeg');
      res.send(details.familyPhoto.data);
    } else {
      console.log('No family photo found for user:', userId);
      res.status(404).send('No family photo found');
    }
  } catch (err) {
    console.error('Error fetching family photo:', err);
    res.status(500).json({ error: 'Server error fetching family photo' });
  }
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rekindle', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(5000, () => console.log('Server started on port 5000'));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 