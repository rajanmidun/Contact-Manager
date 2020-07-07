// CORE MODELS
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

//MODELS
const User = require('../models/User');

//MIDDLEWARE
const Authentication = require('../middleware/authentication');

//------------------------ TO GET THE LOGIN USER DATA--------------------------
router.get('/', Authentication, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (user)
    res.json({ status: true, user });
  else
    res.json({ status: false, msg: 'User not found' });
})

//------------------------ FOR LOGIN-------------------------------------------
router.post('/', async (req, res) => {
  const { error } = dataValidation(req.body);
  if (error)
    res.json({ status: false, msg: error.message });
  else {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      res.status(400).json({ status: false, msg: 'Email Not found' });
    else {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword) {
        const token = await jwt.sign({ id: user.id }, config.get('jwtSecret'), { expiresIn: 36000 });
        res.json({ status: true, token });
      }
      else
        res.status(400).json({ status: false, msg: 'Password not matched' });
    }
  }
})

//------------------------ FUNCTIONS--------------------------
//FOR REGISTERING DATA VALIDATION
function dataValidation(datas) {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }
  return Joi.validate(datas, schema);
}

module.exports = router;