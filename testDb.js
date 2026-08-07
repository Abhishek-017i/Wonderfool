const mongoose = require('mongoose');
const Timeline = require('./Server/models/Timeline');

mongoose.connect('mongodb://Abhishek:goodluck@ac-ee72wgt-shard-00-00.kdtqnjj.mongodb.net:27017,ac-ee72wgt-shard-00-01.kdtqnjj.mongodb.net:27017,ac-ee72wgt-shard-00-02.kdtqnjj.mongodb.net:27017/?ssl=true&replicaSet=atlas-14l6z1-shard-0&authSource=admin&appName=gray-fog', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to DB");
    const docs = await Timeline.find({});
    console.log("Timeline docs:", docs);
    process.exit(0);
  })
  .catch(err => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
