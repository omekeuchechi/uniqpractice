const mongoose = require('mongoose');

const userInfoSchema = mongoose.Schema({
    createdby: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    aboutTxt: {type: String, required: true},
    datecreated: {type: Date, default: Date.now},
})

const AboutUser = mongoose.model('AboutUser', userInfoSchema);
module.exports = AboutUser;