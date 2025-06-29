require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const Details = require('./models/Details');
const User = require('./models/User');
const Message = require('./models/Message');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Reminder = require('./models/Reminder');

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
    let userEmail;
    
    // Check if user is authenticated
    const auth = req.headers.authorization;
    if (auth) {
      try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        userId = decoded.userId;
        userEmail = decoded.email;
        console.log('Family photo request for authenticated user:', userId, 'email:', userEmail);
      } catch (err) {
        console.log('Invalid token, checking query parameter');
      }
    }
    
    // If no authenticated user, check for email in query parameter
    if (!userId && req.query.email) {
      userEmail = req.query.email;
      console.log('Family photo request for email from query:', userEmail);
    }
    
    // If we have an email, find the user by email
    if (userEmail && !userId) {
      const user = await User.findOne({ email: userEmail });
      if (user) {
        userId = user._id;
        console.log('Found user by email:', userEmail, 'userId:', userId);
      }
    }
    
    // For demo purposes, if no user found, try a default email
    if (!userId) {
      console.log('No user found, trying default email');
      const defaultUser = await User.findOne({ email: 'demo@example.com' });
      if (defaultUser) {
        userId = defaultUser._id;
        console.log('Using default user:', userId);
      } else {
        // If no default user exists, try the hardcoded ID as fallback
        userId = '6860b605dd04a5189a27b0ef';
        console.log('No default user found, using hardcoded ID:', userId);
      }
    }
    
    console.log('Searching for family photo for userId:', userId);
    
    // Find Details for the user
    let details = await Details.findOne({ 
      userId: userId, 
      familyPhoto: { $exists: true, $ne: null } 
    }).sort({ _id: -1 });
    
    console.log('Found details:', details ? 'Yes' : 'No');
    console.log('Details userId:', details ? details.userId : 'N/A');
    console.log('Requested userId:', userId);
    console.log('Has familyPhoto:', details ? (details.familyPhoto ? 'Yes' : 'No') : 'N/A');
    
    // If no family photo found for the requested user, try to find any user with a family photo
    if (!details || !details.familyPhoto || !details.familyPhoto.data) {
      console.log('No family photo found for user:', userId, '- searching for any user with family photo');
      details = await Details.findOne({ 
        familyPhoto: { $exists: true, $ne: null } 
      }).sort({ _id: -1 });
      
      if (details) {
        console.log('Found family photo for different user:', details.userId);
        console.log('Has familyPhoto:', details.familyPhoto ? 'Yes' : 'No');
      }
    }
    
    if (details && details.familyPhoto && details.familyPhoto.data) {
      console.log('Sending family photo, size:', details.familyPhoto.data.length, 'bytes');
      res.set('Content-Type', details.familyPhoto.contentType || 'image/jpeg');
      res.send(details.familyPhoto.data);
    } else {
      console.log('No family photo found for any user');
      res.status(404).send('No family photo found');
    }
  } catch (err) {
    console.error('Error fetching family photo:', err);
    res.status(500).json({ error: 'Server error fetching family photo' });
  }
});

app.get('/api/guardians', async (req, res) => {
  try {
    let userId;
    let userEmail;
    
    // Check if user is authenticated
    const auth = req.headers.authorization;
    if (auth) {
      try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        userId = decoded.userId;
        userEmail = decoded.email;
        console.log('Guardians request for authenticated user:', userId, 'email:', userEmail);
      } catch (err) {
        console.log('Invalid token, checking query parameter');
      }
    }
    
    // If no authenticated user, check for email in query parameter
    if (!userId && req.query.email) {
      userEmail = req.query.email;
      console.log('Guardians request for email from query:', userEmail);
    }
    
    // If we have an email, find the user by email
    if (userEmail && !userId) {
      const user = await User.findOne({ email: userEmail });
      if (user) {
        userId = user._id;
        console.log('Found user by email:', userEmail, 'userId:', userId);
      }
    }
    
    // For demo purposes, if no user found, try to find any user with guardians
    if (!userId) {
      console.log('No user found, searching for any user with guardians');
      const detailsWithGuardians = await Details.findOne({ 
        guardians: { $exists: true, $ne: null }
      });
      if (detailsWithGuardians && detailsWithGuardians.guardians && detailsWithGuardians.guardians.length > 0) {
        userId = detailsWithGuardians.userId;
        console.log('Found user with guardians:', userId);
      }
    }
    
    console.log('Searching for guardians for userId:', userId);
    
    // Find Details for the user
    let details = await Details.findOne({ 
      userId: userId, 
      guardians: { $exists: true, $ne: null }
    }).sort({ _id: -1 });
    
    console.log('Found details:', details ? 'Yes' : 'No');
    console.log('Details userId:', details ? details.userId : 'N/A');
    console.log('Requested userId:', userId);
    console.log('Has guardians:', details ? (details.guardians && details.guardians.length > 0 ? 'Yes' : 'No') : 'N/A');
    
    // If no guardians found for the requested user, try to find any user with guardians
    if (!details || !details.guardians || details.guardians.length === 0) {
      console.log('No guardians found for user:', userId, '- searching for any user with guardians');
      details = await Details.findOne({ 
        guardians: { $exists: true, $ne: null }
      }).sort({ _id: -1 });
      
      if (details && details.guardians && details.guardians.length > 0) {
        console.log('Found guardians for different user:', details.userId);
        console.log('Number of guardians:', details.guardians.length);
      }
    }
    
    if (details && details.guardians && details.guardians.length > 0) {
      console.log('Sending guardians data, count:', details.guardians.length);
      res.json({
        guardians: details.guardians.map(guardian => ({
          name: guardian.name,
          relationship: guardian.relationship,
          contact: guardian.contact,
          photo: guardian.photo ? {
            data: guardian.photo.data.toString('base64'),
            contentType: guardian.photo.contentType
          } : null
        }))
      });
    } else {
      console.log('No guardians found for any user');
      res.status(404).json({ error: 'No guardians found' });
    }
  } catch (err) {
    console.error('Error fetching guardians:', err);
    res.status(500).json({ error: 'Server error fetching guardians' });
  }
});

// Debug endpoint to list all users and their family photos
app.get('/api/debug/users', async (req, res) => {
  try {
    console.log('=== DEBUG: Listing all users and their family photos ===');
    
    // Get all users
    const users = await User.find({});
    console.log('All users:', users.map(u => ({ id: u._id, email: u.email })));
    
    // Get all details with family photos
    const details = await Details.find({ familyPhoto: { $exists: true, $ne: null } });
    console.log('All details with family photos:', details.map(d => ({ 
      id: d._id, 
      userId: d.userId, 
      hasFamilyPhoto: !!d.familyPhoto,
      familyPhotoSize: d.familyPhoto ? d.familyPhoto.data.length : 0
    })));
    
    res.json({
      users: users.map(u => ({ id: u._id, email: u.email })),
      details: details.map(d => ({ 
        id: d._id, 
        userId: d.userId, 
        hasFamilyPhoto: !!d.familyPhoto,
        familyPhotoSize: d.familyPhoto ? d.familyPhoto.data.length : 0
      }))
    });
  } catch (err) {
    console.error('Debug error:', err);
    res.status(500).json({ error: 'Debug error' });
  }
});

// Community message endpoints
app.post('/api/messages', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const userId = decoded.userId;
    const userEmail = decoded.email;

    const { text, title, role, subcommunity, parentMessageId } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }
    
    if (!role || !['Patient', 'Guardian', 'Care-taker'].includes(role)) {
      return res.status(400).json({ error: 'Valid role is required' });
    }

    if (!subcommunity) {
      return res.status(400).json({ error: 'Subcommunity is required' });
    }

    // Validate parentMessageId if provided
    if (parentMessageId) {
      const parentMessage = await Message.findById(parentMessageId);
      if (!parentMessage) {
        return res.status(400).json({ error: 'Parent message not found' });
      }
    }

    const message = new Message({
      userId,
      userEmail,
      role,
      subcommunity,
      title: title ? title.trim() : null,
      text: text.trim(),
      parentMessageId: parentMessageId || null
    });

    await message.save();
    
    console.log('Message posted successfully by user:', userEmail, 'role:', role, 'subcommunity:', subcommunity, parentMessageId ? 'as reply' : '');
    res.status(201).json({ 
      success: true, 
      message: 'Message posted successfully',
      messageId: message._id 
    });
  } catch (err) {
    console.error('Error posting message:', err);
    res.status(500).json({ error: 'Server error posting message' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const { role, subcommunity } = req.query;
    
    let query = { parentMessageId: null }; // Only get top-level messages
    if (role && ['Patient', 'Guardian', 'Care-taker'].includes(role)) {
      query.role = role;
    }
    if (subcommunity) {
      query.subcommunity = subcommunity;
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(50); // Limit to last 50 messages

    // Get replies for each message
    const messagesWithReplies = await Promise.all(
      messages.map(async (msg) => {
        const replies = await Message.find({ parentMessageId: msg._id })
          .sort({ timestamp: 1 })
          .limit(10); // Limit replies per message

        return {
          id: msg._id,
          user: msg.userEmail.split('@')[0], // Show only username part
          title: msg.title,
          text: msg.text,
          role: msg.role,
          subcommunity: msg.subcommunity,
          timestamp: msg.timestamp,
          likeCount: msg.likeCount || 0,
          isLiked: false, // Will be updated on frontend if user is logged in
          replies: replies.map(reply => ({
            id: reply._id,
            user: reply.userEmail.split('@')[0],
            text: reply.text,
            role: reply.role,
            timestamp: reply.timestamp,
            likeCount: reply.likeCount || 0
          }))
        };
      })
    );

    console.log(`Fetched ${messages.length} messages${role ? ` for role: ${role}` : ''}${subcommunity ? ` in subcommunity: ${subcommunity}` : ''}`);
    
    res.json({
      messages: messagesWithReplies
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
});

// Get subcommunities information
app.get('/api/subcommunities', async (req, res) => {
  try {
    const subcommunities = [
      {
        id: 'autism-spectrum',
        name: 'Autism Spectrum',
        description: 'Support and discussions for individuals with autism spectrum disorders',
        icon: '🧩',
        color: 'bg-blue-100 text-blue-800'
      },
      {
        id: 'adhd',
        name: 'ADHD',
        description: 'Attention Deficit Hyperactivity Disorder support and strategies',
        icon: '⚡',
        color: 'bg-yellow-100 text-yellow-800'
      },
      {
        id: 'dyslexia',
        name: 'Dyslexia',
        description: 'Reading and language processing challenges support',
        icon: '📚',
        color: 'bg-green-100 text-green-800'
      },
      {
        id: 'dyscalculia',
        name: 'Dyscalculia',
        description: 'Math learning difficulties and strategies',
        icon: '🔢',
        color: 'bg-purple-100 text-purple-800'
      },
      {
        id: 'dyspraxia',
        name: 'Dyspraxia',
        description: 'Motor coordination and planning support',
        icon: '🎯',
        color: 'bg-orange-100 text-orange-800'
      },
      {
        id: 'sensory-processing',
        name: 'Sensory Processing',
        description: 'Sensory integration and processing challenges',
        icon: '🌈',
        color: 'bg-pink-100 text-pink-800'
      },
      {
        id: 'learning-disabilities',
        name: 'Learning Disabilities',
        description: 'General learning challenges and support',
        icon: '🎓',
        color: 'bg-indigo-100 text-indigo-800'
      },
      {
        id: 'developmental-delays',
        name: 'Developmental Delays',
        description: 'Support for developmental milestones and delays',
        icon: '🌱',
        color: 'bg-teal-100 text-teal-800'
      },
      {
        id: 'speech-language',
        name: 'Speech & Language',
        description: 'Communication and language development support',
        icon: '💬',
        color: 'bg-red-100 text-red-800'
      },
      {
        id: 'motor-skills',
        name: 'Motor Skills',
        description: 'Fine and gross motor skills development',
        icon: '🤲',
        color: 'bg-cyan-100 text-cyan-800'
      },
      {
        id: 'general-support',
        name: 'General Support',
        description: 'General disability support and community discussions',
        icon: '🤝',
        color: 'bg-gray-100 text-gray-800'
      }
    ];

    // Get message counts for each subcommunity
    const subcommunityStats = await Promise.all(
      subcommunities.map(async (sub) => {
        const messageCount = await Message.countDocuments({ subcommunity: sub.id });
        const userCount = await Message.distinct('userId', { subcommunity: sub.id }).count();
        return {
          ...sub,
          messageCount,
          userCount
        };
      })
    );

    res.json({
      subcommunities: subcommunityStats
    });
  } catch (err) {
    console.error('Error fetching subcommunities:', err);
    res.status(500).json({ error: 'Server error fetching subcommunities' });
  }
});

// Get replies for a specific message
app.get('/api/messages/:messageId/replies', async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const replies = await Message.find({ parentMessageId: messageId })
      .sort({ timestamp: 1 });

    res.json({
      replies: replies.map(reply => ({
        id: reply._id,
        user: reply.userEmail.split('@')[0],
        text: reply.text,
        role: reply.role,
        timestamp: reply.timestamp
      }))
    });
  } catch (err) {
    console.error('Error fetching replies:', err);
    res.status(500).json({ error: 'Server error fetching replies' });
  }
});

// Like/Unlike a message
app.post('/api/messages/:messageId/like', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const userId = decoded.userId;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const isLiked = message.likedBy.includes(userId);
    
    if (isLiked) {
      // Unlike
      message.likedBy = message.likedBy.filter(id => id.toString() !== userId);
      message.likeCount = Math.max(0, message.likeCount - 1);
    } else {
      // Like
      message.likedBy.push(userId);
      message.likeCount += 1;
    }

    await message.save();

    res.json({
      success: true,
      likeCount: message.likeCount,
      isLiked: !isLiked
    });
  } catch (err) {
    console.error('Error liking message:', err);
    res.status(500).json({ error: 'Server error liking message' });
  }
});

// Flag a message
app.post('/api/messages/:messageId/flag', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const userId = decoded.userId;
    const { messageId } = req.params;
    const { reason } = req.body;

    if (!reason || !['inappropriate', 'spam', 'harassment', 'other'].includes(reason)) {
      return res.status(400).json({ error: 'Valid reason is required' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user already flagged this message
    const alreadyFlagged = message.flaggedBy.some(flag => flag.userId.toString() === userId);
    if (alreadyFlagged) {
      return res.status(400).json({ error: 'You have already flagged this message' });
    }

    // Add flag
    message.flaggedBy.push({
      userId,
      reason,
      timestamp: new Date()
    });
    message.flagCount += 1;
    message.isFlagged = message.flagCount >= 3; // Auto-flag after 3 reports

    await message.save();

    res.json({
      success: true,
      flagCount: message.flagCount,
      isFlagged: message.isFlagged
    });
  } catch (err) {
    console.error('Error flagging message:', err);
    res.status(500).json({ error: 'Server error flagging message' });
  }
});

// Get community statistics
app.get('/api/community/stats', async (req, res) => {
  try {
    const { subcommunity } = req.query;
    
    let query = {};
    if (subcommunity) {
      query.subcommunity = subcommunity;
    }

    const totalMessages = await Message.countDocuments(query);
    const totalReplies = await Message.countDocuments({ 
      parentMessageId: { $ne: null },
      ...(subcommunity && { subcommunity })
    });
    const totalUsers = await Message.distinct('userId', query).count();
    
    const roleStats = await Promise.all(
      ['Patient', 'Guardian', 'Care-taker'].map(async (role) => {
        const count = await Message.countDocuments({ 
          role,
          ...(subcommunity && { subcommunity })
        });
        return { role, count };
      })
    );

    // Get subcommunity stats if not filtering by specific subcommunity
    let subcommunityStats = null;
    if (!subcommunity) {
      const subcommunities = [
        'autism-spectrum', 'adhd', 'dyslexia', 'dyscalculia', 'dyspraxia',
        'sensory-processing', 'learning-disabilities', 'developmental-delays',
        'speech-language', 'motor-skills', 'general-support'
      ];
      
      subcommunityStats = await Promise.all(
        subcommunities.map(async (sub) => {
          const messageCount = await Message.countDocuments({ subcommunity: sub });
          const userCount = await Message.distinct('userId', { subcommunity: sub }).count();
          return { subcommunity: sub, messageCount, userCount };
        })
      );
    }

    res.json({
      totalMessages,
      totalReplies,
      totalUsers,
      roleStats,
      subcommunityStats,
      subcommunity,
      lastUpdated: new Date()
    });
  } catch (err) {
    console.error('Error fetching community stats:', err);
    res.status(500).json({ error: 'Server error fetching community stats' });
  }
});

// Create a reminder
app.post('/api/reminders', authMiddleware, async (req, res) => {
  try {
    const { reason, time } = req.body;
    if (!reason || !time) {
      return res.status(400).json({ error: 'Reason and time are required' });
    }
    const reminder = new Reminder({
      userId: req.user.userId,
      reason,
      time,
      delivered: false
    });
    await reminder.save();
    res.status(201).json({ success: true, reminder });
  } catch (err) {
    res.status(500).json({ error: 'Server error creating reminder' });
  }
});

// Get due reminders for the authenticated user
app.get('/api/reminders/due', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const reminders = await Reminder.find({
      userId: req.user.userId,
      delivered: false,
      time: { $lte: now }
    }).sort({ time: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching due reminders' });
  }
});

// Mark a reminder as delivered
app.patch('/api/reminders/:id/delivered', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { delivered: true },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ success: true, reminder });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating reminder' });
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