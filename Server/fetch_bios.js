const mongoose = require('mongoose');
const Person = require('./models/Person');

const MONGO_URI = 'mongodb://Abhishek:goodluck@ac-ee72wgt-shard-00-00.kdtqnjj.mongodb.net:27017,ac-ee72wgt-shard-00-01.kdtqnjj.mongodb.net:27017,ac-ee72wgt-shard-00-02.kdtqnjj.mongodb.net:27017/?ssl=true&replicaSet=atlas-14l6z1-shard-0&authSource=admin&appName=gray-fog';

async function fetchBios() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB.");

  const persons = await Person.find({ bio: { $exists: true, $ne: "" } }).limit(5);
  
  for (const person of persons) {
    console.log(`\n\n--- Person: ${person.name?.full || person.name?.native} (${person._id}) ---`);
    console.log(person.bio);
  }
  
  await mongoose.disconnect();
}

fetchBios().catch(console.error);
