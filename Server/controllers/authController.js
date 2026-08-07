const User = require('../models/User');

const syncUser = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.firebaseUser;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: name || 'Wonderfool User',
        email,
        avatar: picture || '',
      });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error syncing user', error: err.message });
  }
};

module.exports = { syncUser };