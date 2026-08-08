const mongoose = require('mongoose');
const mongoURI = 'mongodb://127.0.0.1:27017/wonderfool';
mongoose.connect(mongoURI).then(async () => {
  const Wishlist = mongoose.model('Wishlist', new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, seriesId: mongoose.Schema.Types.ObjectId }, { strict: false }));
  const Timeline = mongoose.model('Timeline', new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, seriesId: mongoose.Schema.Types.ObjectId }, { strict: false }));

  for (const Model of [Wishlist, Timeline]) {
    const duplicates = await Model.aggregate([
      { $group: { _id: { userId: '$userId', seriesId: '$seriesId' }, count: { $sum: 1 }, docs: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    console.log(Model.modelName, 'found duplicates:', duplicates.length);
    for (const dup of duplicates) {
      const docsToRemove = dup.docs.slice(1);
      await Model.deleteMany({ _id: { $in: docsToRemove } });
      console.log('Removed', docsToRemove.length, 'duplicates for', dup._id);
    }
  }
  
  console.log('Cleanup complete.');
  process.exit(0);
}).catch(console.error);
