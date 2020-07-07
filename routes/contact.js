// CORE MODELS
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const config = require('config');

//MODELS
const Contact = require('../models/Contact');
const User = require('../models/User');

//MIDDLEWARE
const Authentication = require('../middleware/authentication');

//------------------------ TO GET ALL USERS CONTACT--------------------------
router.get('/', Authentication, async (req, res) => {
  const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
  res.json({ status: true, contacts });
})

//------------------------ TO ADD NEW CONTACT--------------------------
router.post('/', Authentication, async (req, res) => {
  const { error } = dataValidation(req.body);
  if (error)
    res.status(400).json({ status: false, msg: error.message });
  else {
    const { name, email, phone, type } = req.body;
    const contact = await Contact.create({
      name,
      email,
      phone,
      type,
      user: req.user.id
    });
    res.json({ status: true, contact });
  }
})

//------------------------ TO UPDATE CONTACT--------------------------
router.put('/:id', Authentication, async (req, res) => {
  const { error } = dataValidation(req.body);
  if (error)
    res.status(400).json({ status: false, msg: error.message });
  else {
    const { name, email, phone, type } = req.body;
    const contact = await Contact.findById(req.params.id);
    if (contact) {
      if (contact.user == req.user.id) {
        contact.name = name;
        contact.email = email;
        contact.phone = phone;
        contact.type = type;
        await contact.save();
        res.json({ status: true, contact, message: 'Contact updated successfully' });
      }
      else
        res.json({ status: false, message: 'You are not authorized' });
    }
    else
      res.json({ status: false, message: 'Contact Not found' });
  }
})

//------------------------ TO DELETE CONTACT--------------------------
router.delete('/:id', Authentication, async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (contact) {
    if (contact.user == req.user.id) {
      await Contact.deleteOne({ _id: req.params.id });
      res.json({ status: true, message: 'Contact removed successfully' });
    }
    else
      res.status(401).json({ status: false, message: 'You are not authorized' });
  }
  else
    res.status(400).json({ status: false, message: 'Contact Not found' });
})

//------------------------ FUNCTIONS--------------------------
//FOR REGISTERING DATA VALIDATION
function dataValidation(datas) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.string().min(10).required(),
    type: Joi.string(),
    _id: Joi.string(),
  }
  return Joi.validate(datas, schema);
}

module.exports = router;