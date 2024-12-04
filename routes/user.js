const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authJs = require('../middlewares/auth');


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

router.post('/login', async (req, res) => {
    
    try{
        const user = await User.findOne({email: req.body.email});
    
        if(!user){
            return res.status(401).json('User does not exist');
        }

        const result = await bcrypt.compare(req.body.password, user.password);

        if(user && result){
            const token = jwt.sign({userId: user._id, isAdmin: user.isAdmin}, 
                process.env.TOKEN_SECRET, {expiresIn: '1d'});

            return res.status(200).json({
                message: "user authenticated",
                token: token
            });
        }
    }catch(error){
        res.status(500).json({
            message: "Internal server error",
            error: error 
        })
    }

})

router.get('/', authJs, async (req, res)=> {
    const isAdmin = req.decoded.isAdmin;
    
    if(!isAdmin){
        return res.status(400).send("You are not an admin");
    }

    const users = await User.find();

    res.status(200).json({
        message: "Users fetched successfully",
        users: users
    })
})

module.exports = router;