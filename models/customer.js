const mongoose = require('mongoose');
const Joi = require('joi');



const customerSchema = mongoose.Schema({
    isGold: { type: Boolean, required: true},
    name: {type: String, required: true},
    phone: {type: Number, required: true}
});

const Customer = mongoose.model('Customer', customerSchema);

//validate object in request body
function validateCustomer(customer){
    const schema = Joi.object({
        isGold: Joi.boolean().required(),
        name: Joi.string().required(),
        phone: Joi.number().required()
    });
    return Joi.validate(customer,schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;