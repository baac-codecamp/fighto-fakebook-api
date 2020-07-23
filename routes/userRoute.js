const express = require('express')
const { body } = require('express-validator');
const userController = require('../controllers/userController')
const authentication = require('../middleware/authenticationHandler');
const authorization = require('../middleware/authorizationHandler');

const router = express.Router()

router.post('/signup', [
    //validation : express validator
    body('displayname').not().isEmpty().withMessage('Field displayname is required'),
    body('email').not().isEmpty().withMessage('Field email is required').isEmail().withMessage('Wrong email format'),
    body('password').not().isEmpty().withMessage('Field password is required').isLength({ min: 6 }).withMessage('Password must be  at least 6 digits'),
    body('gender').not().isEmpty().withMessage('Field gender is required'),
    body('firstname').not().isEmpty().withMessage('Field firstname is required'),
    body('lastname').not().isEmpty().withMessage('Field lastname is required'),
    body('address').not().isEmpty().withMessage('Field address is required'),
    body('education').not().isEmpty().withMessage('Field education is required'),
    
    
   
], userController.signup);
router.post('/signin',
    body('email').not().isEmpty().withMessage('Field email is required').isEmail().withMessage('Wrong email format'),
    body('password').not().isEmpty().withMessage('Field password is required')
    , userController.signin);
router.get('/me', authentication.isLoggedIn, userController.getProfile);

router.get('/', userController.index);
router.get('/:id', authentication.isLoggedIn, userController.getUserById);
router.put('/:id', authentication.isLoggedIn, userController.updateUser);
router.delete('/:id', [authentication.isLoggedIn, authorization.isAdmin], userController.deleteUser);
router.post('/list',
    body('email').not().isEmpty().withMessage('Field email is required').isEmail().withMessage('Wrong email format')
    , authentication.isLoggedIn, userController.list);
module.exports = router

