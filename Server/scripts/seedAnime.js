const { seedMedia } = require('./seedAniList');

seedMedia('ANIME', 100).catch(err => {
  console.error('Anime seed failed:', err.message);
  process.exit(1);
});