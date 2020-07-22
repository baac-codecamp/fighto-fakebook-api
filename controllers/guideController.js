const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config/index')
const Guide = require("../models/guideModel")

const guides = [
    {
        id: "1",
        name: "peter"
    },
    {
        id: "2",
        name: "student"
    }
];

async function findGuideById(id) {
    return guides.find(item => {
        if (item.id == id) {
            return item;
        } else {
            return null;
        }
    });
}

module.exports.index = async (req, res, next) => {
    try {
        const guides = await Guide.find();
        res.status(200).json({
            success: true,
            data: guides
        });

    } catch (err) {
        next(err);
    }

}

module.exports.getGuideById = function (req, res, next) {
    console.log(`Id : ${req.params.id}`);
    let guide = guides.find(item => item.id == req.params.id);
    res.status(200).json(guide);
}

exports.getProfile = (req, res, next) => {
    const { _id, name, email, role } = req.guide;
    try {
        res.status(200).json({
            success: true,
            guide: {
                id: _id,
                name: name,
                email: email,
                role: role
            }
        });
    } catch (err) {
        next(err);
    }

}

module.exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        //validation
        //check validation result ก่อน โดย req จะแปะ error validation มาด้วย
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check data');
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }

        const existEmail = await Guide.findOne({ email: email });

        if (existEmail) {
            const error = new Error('Email already exits');
            error.statusCode = 400;
            throw error;
        }

        let guide = new Guide();
        guide.name = name;
        guide.email = email;
        guide.password = await guide.encryptPassword(password);

        await guide.save();

        res.status(201).json({
            data: guide,
            success: true
        });
    } catch (err) {
        next(err);
    }
}

exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log
            (`email: ${email} 
password: ${password}`)

        //validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check data');
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }
        const guide = await Guide.findOne({ email: email });
        if (!guide) {
            const error = new Error('Authentication Failed, Guide not found');
            error.statusCode = 404;
            throw error;
        }

        const isMatch = await guide.comparePassword(password);
        if (!isMatch) {
            const error = new Error('Incorrect password');
            error.statusCode = 401;
            throw error;
        }

        //create token
        console.log(guide._id);
        const token = await jwt.sign({
            id: guide._id,
            role: guide.role
        }, config.JWT_SECRET, { expiresIn: '10 days' });

        //decode expiration date
        const expires_in = jwt.decode(token);

        return res.status(200).json({
            success: true,
            token: token,
            expires_in: expires_in.exp,
        });

    } catch (error) {
        next(error);
    }
}

module.exports.updateGuide = async (req, res) => {
    // const token = req.header("authorization");
    const { id } = req.params;
    // const id =  req.params.id;
    console.log(`Id : ${id}`);
    const guide = await findGuideById(id);
    if (guide) {
        console.log(`Guide has been updated. id : ${guide.id}`);
    } else {
        console.log(`Guide is not exits.`);
        res.status(404).send({ message: "Not found Guide with id " + id });
    }

    // console.log(guide);
    //guides.push(guide);
    res.status(201).json(guide);
}

module.exports.deleteGuide = async function (req, res) {
    // const token = req.header("authorization");
    const { id } = req.params;
    // const id =  req.params.id;
    console.log(`Id : ${id}`);
    const guide = await findGuideById(id);
    if (guide) {
        console.log(`Guide has been delete. id : ${guide.id}`);
    } else {
        console.log(`Guide is not exits.`);
        res.status(404).send({ message: "Not found Guide with id " + id });
    }
    res.status(200).json({ message: "success" });;
}

