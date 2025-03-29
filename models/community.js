const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

module.exports = mongoose.model('User', UserSchema);



// async function addFollower(user, followerId) {
//     const userDoc = await User.findById(user._id);
//     userDoc.followers.push(followerId);
//     await userDoc.save();
//   }
  
//   async function addFollowing(user, followingId) {
//     const userDoc = await User.findById(user._id);
//     userDoc.following.push(followingId);
//     await userDoc.save();
//   }