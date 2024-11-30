const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post(`/create`, async (req, res) => {
    try {

        const exitingUser = await User.find({email: req.body.email});

        if (exitingUser.lenght > 0) {
            return res.status(497).send("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
    
        const response = await user.save();

        const resData = {
            id: response._id,
            name: response.name,
            email: response.email
        }
    
        res.status(201).json({
            message: "User created successfully",
            user: resData
        });
    } catch (err) {
        res.status(403).json({
            message: "user was not created",
            error: err
        })
    }
})

module.exports = router;