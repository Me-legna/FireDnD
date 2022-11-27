// backend/routes/api/users.js
const express = require('express')

const { check } = require('express-validator');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'), //'Please provide a valid email.'
  // check('username')
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 4 })
  //   .withMessage('Please provide a username with at least 4 characters.'),
  check('username').notEmpty().withMessage('Username is required'),
    // .not()
    // .isEmail()
    // .withMessage('Username cannot be an email.'),
  check('firstName').notEmpty().withMessage('First Name is required'),
  check('lastName').notEmpty().withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;

    const userByEmail = await User.findOne({where:{email}})
    if(userByEmail){
      res.statusCode = 403
      res.json({
        "message": "User already exists",
        "statusCode": res.statusCode,
        "errors": {
        "email": "User with that email already exists"
        }
      })
    }
    const userByUserName = await User.findOne({where:{username}})
    if(userByUserName){
      res.statusCode = 403
      res.json({
        "message": "User already exists",
        "statusCode": res.statusCode,
        "errors": {
        "email": "User with that username already exists"
        }
      })
    }

    const user = await User.signup({ firstName, lastName, email, username, password });
    const newUser = user.toJSON()

    const token = await setTokenCookie(res, user);

    return res.json({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      username: newUser.username,
      // token,
    });
  }
);

//Validation Errors
// router.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   console.error(err);
//   res.json({
//     title: err.title || 'Validation Error',
//     message: err.message,
//     errors: err.errors,
//     stack: isProduction ? null : err.stack
//   });
// })

module.exports = router;
