require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'User'));

const migrateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for Migration...");

    // Update all users who don't have a role field yet
    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'admin', student_id: null } }
    );

    console.log(`Migration Complete: Updated ${result.modifiedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration Failed:", err);
    process.exit(1);
  }
};

migrateUsers();
