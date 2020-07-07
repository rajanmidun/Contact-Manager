// CORE MODELS
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

//MODELS
const User = require('../models/User');

//------------------------ TO GET ALL USERS DATA--------------------------
router.get('/', (req, res) => {
  res.json({ status: true });
})

//------------------------ TO REGISTER NEW USER--------------------------
router.post('/', async (req, res) => {
  const { error } = dataValidation(req.body);
  if (error)
    res.json({ status: false, msg: error.message });
  else {
    let { name, email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      res.status(400).json({ status: false, msg: 'User already exists' });
    }
    else {
      const salt = await bcrypt.genSalt(10);
      const user = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, salt)
      })
      // await user.save();
      const token = await jwt.sign({ id: user.id }, config.get('jwtSecret'), { expiresIn: 36000 });
      res.json({ status: true, token, msg: 'Registration successfully' });
    }
  }
})


//------------------------ FUNCTIONS--------------------------
//FOR REGISTERING DATA VALIDATION
function dataValidation(datas) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }
  return Joi.validate(datas, schema);
}

module.exports = router;