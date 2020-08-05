const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config/index')
const User = require("../models/userModel")
const moment = require('moment')
const users = [
    {
        id: "1",
        name: "peter"
    },
    {
        id: "2",
        name: "student"
    }
];

async function findUserById(id) {
    return User.find(item => {
        if (item._id == id) {
            return item;
        } else {
            return null;
        }
    });
}

module.exports.index = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users
        });

    } catch (err) {
        next(err);
    }

}

module.exports.getUserById = function (req, res, next) {
    console.log(`Id : ${req.params.id}`);
    let user = users.find(item => item.id == req.params.id);
    res.status(200).json(user);
}

exports.getProfile = (req, res, next) => {
    const { _id, name, email, role } = req.user;
    try {
        res.status(200).json({
            success: true,
            user: {
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
        //const { name, email, password } = req.body;
        const { email, password, firstname, lastname, gender,address, education, displayname } = req.body;

        //validation
        //check validation result ก่อน โดย req จะแปะ error validation มาด้วย
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check data');
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }

        const existEmail = await User.findOne({ email: email });

        if (existEmail) {
            const error = new Error('Email already exits');
            error.statusCode = 400;
            throw error;
        }

        let user = new User();
        //user.name = name;
        user.email = email;
        user.password = await user.encryptPassword(password);
        user.firstname = firstname;
        user.lastname = lastname;
      
        user.gender = gender;
        user.address = address;
        user.education = education;
        user.displayname = displayname;
        user.datecreate = moment().format();
        
        await user.save();

        res.status(201).json({
            data: user,
            success: true
        });
    } catch (err) {
        next(err);
    }
}

exports.signin = async (req, res, next) => {
    try {
        const { txtUsername, txtPassword } = req.body;
        console.log
            (`txtUsername: ${txtUsername} 
            txtUsername: ${txtPassword}`)

        //validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Please check data');
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }
        const user = await User.findOne({ email: txtUsername });
        if (!user) {
            const error = new Error('Authentication Failed, User not found');
            error.statusCode = 404;
            throw error;
        }

        const isMatch = await user.comparePassword(txtPassword);
        if (!isMatch) {
            const error = new Error('Incorrect password');
            error.statusCode = 401;
            throw error;
        }

        //create token
        console.log(user._id);
        const token = await jwt.sign({
            id: user._id,
            role: user.role
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

module.exports.updateUser = async (req, res) => {
    const { email, password, firstname, lastname, gender, address, education, displayname } = req.body;
    const { id } = req.params;
    console.log(`Id : ${id}`);
    const user = await User.findOne({ _id: id });
    if (user) {
        console.log(`User has been updated. id : ${user._id}`);
    } else {
        console.log(`User is not exits.`);
        res.status(404).send({ message: "Not found User with id " + id });
    }
    if (email) {
        user.email = email;
    }
    if (password) {
        user.password = await user.encryptPassword(password);
    }
    if (firstname) {
        user.firstname = firstname;
    }
   if (lastname) {
        user.lastname = lastname;
   }
    if (gender) {
        user.gender = gender;
    }
    if (address) {
        user.address = address;
    }
    if (education) {
        user.education = education;
    }
    if (displayname) {
        user.displayname = displayname;
    }
    
    await user.save();

    res.status(201).json({
        data: user,
        success: true
    });
}

module.exports.deleteUser = async function (req, res) {
    // const token = req.header("authorization");
    const { id } = req.params;
    // const id =  req.params.id;
    console.log(`Id : ${id}`);
    const user = await findUserById(id);
    if (user) {
        console.log(`User has been delete. id : ${user.id}`);
    } else {
        console.log(`User is not exits.`);
        res.status(404).send({ message: "Not found User with id " + id });
    }
    res.status(200).json({ message: "success" });;
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
        
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('Authentication Failed, User not found');
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            data: user,
            success: true
        });

    } catch (error) {
        next(error);
    }
}