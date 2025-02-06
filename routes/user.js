const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authJs = require('../middlewares/auth');


router.post('/create', async (req, res)=> { //localhost:3000/api/v1/user/create
    try{
        const existingUser = await User.find({email: req.body.email});

        if(existingUser.length > 0){
            return res.status(497).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = new User({
            name : req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
    
            const createdUser =  await newUser.save();

            const response = {
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email
            }
    
            res.status(201).json({
                message: "User created successfully",
                user: response
            });
    }catch(err){
        res.status(500).json({
            message: 'Error occurred while creating user',
            error: err
        })
    }
});


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
});

//updating user information
router.patch('/profile', authJs, async (req, res) => {
    const userId = req.decoded.userId;
    const userInfo = req.body;

    let user = await User.findById(userId);

    if(!user){
        return res.status(400).send("Couldn't find user");
    }

    for(propName in userInfo){
        switch(propName){
            case 'name':
                user.name = userInfo.name;
                break;
            case 'email':
                user.email = userInfo.email;
                break;
            case 'phoneNumber':
                user.phoneNumber = userInfo.phoneNumber;
                break;
            case 'dateOfBirth':
                user.dateOfBirth = userInfo.dateOfBirth;
                break;
            case 'avatar':
                user.avatar = userInfo.avatar;
                break;
            case 'country':
                user.country = userInfo.country;
                break;
            case 'city':
                user.city = userInfo.city;
                break;
            case 'admin':
                user.isAdmin = userInfo.admin;
                break;
            default:
                return user;
        }
    }

    try{
        const response = await user.save();
        res.status(200).json({message: "User profile updated successfully", user: response});
    }catch(error){
        res.status(500).json({
            message: "Something occurred could not update user profile", 
            error: error
        });
    }
});

//Admin specific api to delete a user
router.delete('/:userId', authJs, async (req, res) => {
    const userId = req.params.userId;
    const isAdmin = req.decoded.isAdmin;

    if(!isAdmin){
        return res.status(400).send("Unauthorized, you are not an admin");
    }

    
    try{
        const deletedUser = await User.findByIdAndDelete(userId);

        if(!deletedUser){
            return res.status(404).send("User does not exist");
        }
    
        res.status(200).json({message: "User deleted successfully", deletedUser: deletedUser})
    }catch(error){
        res.status(400).json({message: "Error ocurred, user was not deleted", 
            error: error
        })
    }
})

module.exports = router;