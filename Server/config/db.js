const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://Abhishek:goodluck@ac-ee72wgt-shard-00-00.kdtqnjj.mongodb.net:27017,ac-ee72wgt-shard-00-01.kdtqnjj.mongodb.net:27017,ac-ee72wgt-shard-00-02.kdtqnjj.mongodb.net:27017/?ssl=true&replicaSet=atlas-14l6z1-shard-0&authSource=admin&appName=gray-fog';
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;