const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedUser = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: 'testuser@example.com' });
    if (existing) {
      console.log('Test user already exists');
      process.exit(0);
    }

    const password = 'Test1234!';
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: hashed
    });

    await user.save();
    console.log('Test user created: testuser@example.com / Test1234!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedUser();
