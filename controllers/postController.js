const mongoose = require('mongoose');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const { validationResult } = require('express-validator');
const moment = require('moment'); 

module.exports.index = async function (req, res , next) {
    
    try {
             // select * from post; 
        const { email } = req.params;
        console.log(`id : ${email}`)
        
        const posts = await Post.findById(email).select('email','postImage','postText','timestamp')
        console.log(posts)
        res.status(200).json({
            data: posts,
            success: true
        });

    } catch (err) {
        next(err); 
     }
}

module.exports.getComments = async function (req, res) {

    try {
        const { id } = req.params;
        console.log(`id : ${id}`);
        //const comments = await Comment.find();
        const postWithComments = await Post.findById(id)
            .populate('comments', 'message user');

        console.log(postWithComments);
        res.status(200).json({
            data: postWithComments,
            success: true
        });
    } catch (err) {
        res.status(500).json(
            {
                error: [{
                    code: 500,
                    message: err.message
                }]
            });
    }
}

module.exports.addcomment = async (req, res) => {
    console.log(req.body);
    const {post} = req.params;
    const { message,likeCounts,userid } = req.body;
    console.log(`userid : ${userid}`)
    console.log(`message : ${message}`);
    console.log(`likeCount : ${likeCounts}`);
    console.log(`post : ${post}`)
    let comment = new Comment({
        message: message,
        likeCounts: likeCounts,
        createdDate: moment().format(),
        post: post,
        userid: userid,
    });

    try {
        await comment.save();
        res.status(201).json({ data: comment, success: true });
    } catch (err) {
        res.status(500).json({
            errors: { err }
        });
    }
}

module.exports.updateComment = async (req, res, next) => {
    try {
        const { userid } = req.params;
        const { message } = req.body;
        const { likeCounts} = req.body;
        const { history}  = moment().format();
        //console.log(req.body);
        console.log(`userid : ${userid}`);
        console.log(`message : ${message}`);
        console.log(`likeCounts : ${likeCounts}`);
        console.log(`history : ${history}`);
        const post = await Post.updateOne({ _userid:    userid },
            { message: message,likeCounts: likeCounts, history: history } 
        );

        // console.log(post);

        if (post.nModified === 0) {
            throw new Error('Cannot update');
        } else {
            res.status(201).json(
                {
                    message: "Update completed",
                    success: true
                });
        }
    } catch (err) {
        res.status(500).json({
            error: [{
                code: 500,
                message: err.message
            }]
        });
    }
}

module.exports.getTags = async function (req, res, next) {

    try {
        const { id } = req.params;
        console.log(`id : ${id}`);
        const post = await Post.findOne({ _id: id }).select('tags');
        console.log(post);
        res.status(200).json({
            data: post,
            success: true
        });
    } catch (err) {
        res.status(500).json(
            {
                error: [{
                    code: 500,
                    message: err.message
                }]
            });
    }
}


module.exports.getPostById = async (req, res, next) => {
    const { id } = req.params;
    console.log(`Id : ${id}`);
    const post = await Post.findOne({ _id: id });
    res.status(200).json({ data: { post } });
}

//module createPost
module.exports.createPost = async (req, res) => {
    console.log(req.body);
    const { email, postImage, postText } = req.body;
    console.log(`email : ${email}`);
    console.log(`postImage : ${postImage}`);
    console.log(`postText : ${postText}`);
    let post = new Post({
        email: email,
        postImage: postImage,
        postText: postText,
        createdDate: moment().format(),
        history:moment().format()
    });

    try {
        await post.save();
        res.status(201).json({ data: post, success: true });
    } catch (err) {
        res.status(500).json({
            errors: { err }
        });
    }
}

module.exports.updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { postImage } = req.body;
        const { postText} = req.body;
        const { history}  = moment().format();
        //console.log(req.body);
        console.log(`Id : ${id}`);
        console.log(`postImage : ${postImage}`);
        console.log(`postText : ${postText}`);
        console.log(`history : ${history}`);
        const post = await Post.updateOne({ _id: id },
            { postImage: postImage,postText: postText, history: history } 
        );

        // console.log(post);

        if (post.nModified === 0) {
            throw new Error('Cannot update');
        } else {
            res.status(201).json(
                {
                    message: "Update completed",
                    success: true
                });
        }
    } catch (err) {
        res.status(500).json({
            error: [{
                code: 500,
                message: err.message
            }]
        });
    }
}

module.exports.updatePostSome = async (req, res, next) => {

    try {
        console.log(req.body);
        const { id } = req.params;
        const { postImage } = req.body;
        const { postText} = req.body;
        const { history}  = moment().format();
      
        
        console.log(`Id : ${id}`);
        console.log(`postImage : ${postImage}`);
        console.log(`postText : ${postText}`);
        console.log(`history : ${history}`);
        const post = await Post.findByIdAndUpdate(id, {
            postImage: postImage,
            postText: postText ,
            history: history ,
            
        });

        console.log(`post : ${post}`);

        if (!post) {
            throw new Error('Notthing to update');
        } else {
            res.status(201).json({ data: post, success: true });
        }

    } catch (err) {
        res.status(500).json({
            errors: {
                code: 500,
                message: err.message
            }
        });
    }
}

module.exports.deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            res.status(404).json({
                success: fasle, errors: {
                    message: "Cannot delete"
                }
            });
        }

        res.status(200).json({
            message: 'Deleted have been completed',
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                success: fasle,
                message: "Cannot delete"
            }
        })
    }
}

module.exports.list = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log(`email: ${email}`)

        //validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check data');
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }
        
        const user = await Post.find({ email: email })
        .populate('comments', 'message user');
        const users = [];
        users.push(user)

        if (!user) {
            const error = new Error('Authentication Failed, User not found');
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            success: true,
            users: {users},
        });

    } catch (error) {
        next(error);
    }
}
