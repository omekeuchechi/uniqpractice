const express = require('express');
const router = express.Router();
const AboutUser = require('../models/userInfo');
const authJs = require('../middlewares/auth');

router.post('/create', authJs, async (req, res) => {
    const userId = req.decoded.userId;
    const user = await User.findById(userId);
    try {
        const aboutUser = new AboutUser(req.body);
        await aboutUser.save();
        res.status(201).json(aboutUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});