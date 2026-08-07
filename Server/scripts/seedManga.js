const { seedMedia } = require('./seedAniList');

seedMedia('MANGA', 100).catch(err => {
  console.error('Manga seed failed:', err.message);
  process.exit(1);
});