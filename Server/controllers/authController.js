const User = require('../models/User');

const syncUser = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.firebaseUser;

    let user = await User.findOne({ firebaseUid: uid });

    const nameToSave = req.body.name || name || (user ? user.name : 'Wonderfool User');
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameToSave)}&background=random`;
    const avatarToSave = picture || defaultAvatar;

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: nameToSave,
        email,
        avatar: avatarToSave,
      });
    } else {
      user.name = nameToSave;
      user.avatar = avatarToSave;
      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error syncing user', error: err.message });
  }
};

module.exports = { syncUser };