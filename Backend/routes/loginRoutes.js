import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Make sure this path points to your user model file.
import User from '../models/login.js'; 

const router = express.Router();

// ## ROUTE 1: Register a new user
// This route is unchanged.
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with that username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      username, 
      password: hashedPassword, 
      role 
    });

    const savedUser = await newUser.save();
    res.status(201).json({ 
        msg: 'User registered successfully!',
        user: {
            id: savedUser.id,
            username: savedUser.username,
            role: savedUser.role
        }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during registration');
  }
});

// ## ROUTE 2: Log in an existing user (WITH DEBUGGING CHANGES)
// METHOD: POST at /api/auth/login
router.post('/login', async (req, res) => {
  console.log('\n--- LOGIN ATTEMPT INITIATED ---');
  // 1. Log the incoming data from Postman.
  console.log('1. Request Body Received:', req.body);

  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // 2. Find the user in the database.
    const user = await User.findOne({ username });
    console.log('2. User found in database:', user);

    if (!user) {
      console.log('--> CONCLUSION: User does not exist in the database.');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Compare the provided password with the stored hash.
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('3. Password comparison result (isMatch):', isMatch);

    if (!isMatch) {
      console.log('--> CONCLUSION: Passwords do not match.');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('--> SUCCESS: Login credentials are valid. Creating JWT token.');
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role });
      }
    );

  } catch (err) {
    // This will catch any unexpected server errors.
    console.error('!!! SERVER ERROR during login attempt:', err);
    res.status(500).send('Server error during login');
  }
});

export default router;
