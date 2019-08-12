//route for users
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {validate, User} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config =require('config');
const auth = require('../middleware/auth');


router.get('/me', auth, async (req, res)=>{
    //this endpoint should only be available to authenticated users
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);

})


router.post('/', async (req, res) =>{
    const {error} = validate(req.body);
    console.log('test 1');
    if(error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne( { email: req.body.email});
    if(user) return res.status(400).send('User already registered.');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try{
        await user.save();
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user,['_id', 'name','email']));
    }catch(ex){
        return res.status(400).send(ex.errors);
    }
})

module.exports = router;