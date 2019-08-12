const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');


const userSchema = mongoose.Schema({
    name: {
        type: String, 
        require: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true
    },
    password:{
        type:String,
        require: true
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}
const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email(),
        password: Joi.string().required()
    });

    return Joi.validate(user, schema);
}

module.exports.validate = validateUser;
module.exports.User = User;