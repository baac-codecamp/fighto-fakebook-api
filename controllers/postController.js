const mongoose = require('mongoose');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

module.exports.index = async function (req, res , next) {
    
    try {
             // select * from post; 
        const posts = await Post.find();
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

module.exports.createPost = async (req, res) => {
    console.log(req.body);
    const { title, tags } = req.body;
    console.log(`Title : ${title}`);
    let post = new Post({
        title: title,
        tags: tags
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
        const { title } = req.body;
        console.log(req.body);
        console.log(`Id : ${id}`);
        console.log(`title : ${title}`);
        const post = await Post.updateOne({ _id: id },
            { title: title }
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
        const { title } = req.body;

        console.log(`Id : ${id}`);
        const post = await Post.findByIdAndUpdate(id, {
            title: title
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

