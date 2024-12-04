const express = require('express');
const router = express.Router();
const authJs = require('../middlewares/auth');
const Post = require('../models/post');
const User = require('../models/user');

router.post('/create', authJs, async (req, res) => {

    const user = req.decoded;

    if(!user.isAdmin){
       return res.status(401).send("Not an admin, can't create post");
    }

    const post = new Post({
        category: req.body.category,
        content: req.body.content,
        createdby: user.userId
    })

    try{
        const createdPost = await post.save();
        res.status(200).json({
            message: "Post created successfully",
            post: createdPost
        })
    }catch(error){
        return res.status(500).json({
            message: "Error creating post",
            error: error
        })
    }
});


module.exports = router;
