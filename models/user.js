const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phoneNumber: String,
    dateOfBirth: Date,
    avatar: String,
    postCreated: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    commentCreated: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    commentsLiked: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    postsLiked: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    isAdmin: {type: Boolean, default: false},
    country: String,
    city: String,
    datecreated: {type: Date, default: Date.now},
});

const User = mongoose.model('User', userSchema);

module.exports = User;