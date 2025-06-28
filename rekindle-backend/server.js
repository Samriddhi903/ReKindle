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
    res.status(201).json({ message: 'Details saved!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/signup', async (req, res) => {
  console.log('Signup body:', req.body); // Debug print
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'User already exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hash });
  await user.save();
  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ success: true, token });
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

app.get('/api/family-photo', authMiddleware, async (req, res) => {
  // Find Details for the logged-in user (by userId)
  const details = await Details.findOne({ userId: req.user.userId, familyPhoto: { $exists: true, $ne: null } }).sort({ _id: -1 });
  if (details && details.familyPhoto && details.familyPhoto.data) {
    res.set('Content-Type', details.familyPhoto.contentType || 'image/jpeg');
    res.send(details.familyPhoto.data);
  } else {
    res.status(404).send('No family photo found');
  }
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rekindle', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => app.listen(5000, () => console.log('Server started on port 5000')))
  .catch(err => console.error(err)); 