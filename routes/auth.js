//route for users
const Joi = require('joi');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config= require('config');


router.post('/', async (req, res) =>{
    const {error} = validate(req.body);
    console.log('test 1');
    if(error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne( { email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword ) return res.status(400).send('Invalid email or password');
    const token = user.generateAuthToken();
    res.send(token);
    
})

function validate(user){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().required()
    });

    return Joi.validate(user, schema);
}



module.exports = router;