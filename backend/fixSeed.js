const connectDB = require('./config/db');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const fix = async () => {
  try {
    await connectDB();
    const user = await User.findOne({ email: 'testuser@example.com' }).select('+password');
    if (!user) {
      console.log('No test user found to fix');
      process.exit(0);
    }

    user.password = 'Test1234!'; // set plain password so pre-save will hash it once
    await user.save();
    console.log('Test user password reset to Test1234! (hashed once)');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing seed:', err);
    process.exit(1);
  }
};

fix();
