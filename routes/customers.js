const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Customer, validate} = require('../models/customer');
const auth = require('../middleware/auth');




//-----------Async helper function
async function createCustomer(customer){
    const newCustomer = new Customer({
        isGold: customer.isGold,
        name: customer.name,
        phone: customer.phone
    });

    return await newCustomer.save();
}

async function updateCustomer(id, customer){
    const updatedCustomer = await Customer.findByIdAndUpdate(id,{
        $set:{
            isGold: customer.isGold,
            name: customer.name,
            phone: customer.phone
        }
    }, {new: true});

    return updatedCustomer;
}

async function deleteCustomer(id){
    return await Customer.findByIdAndDelete(id);
}



//-----route functions-------------
router.get('/', async (req, res) =>{
    //get a list of customers
    const customer = await Customer.find().sort({name: 1});
    if(!customer){
        return res.status(403).send("customer list is empty or cannot be found");
    }
    return res.send(customer);

});

router.get('/:id', (req, res )=>{
    Customer.findById(req.params.id)
    .then(result =>{return res.send(result)})
    .catch(err => {return res.status(403).send(err)});
})

router.post('/', auth,(req, res) =>{
    const isValid = validate(req.body);
    console.log("isValid: ", isValid);
    if(!isValid){
        return res.status(403).send("The customer object is not valid.");
    }
    createCustomer(req.body)
    .then(result =>{
        console.log(result);
        res.send(result);
    })
    .catch(err =>{
        res.status(403).send("Cannot create new customer");
    });
});

router.put('/:id',auth, (req, res)=>{
    const isValid = validate(req.body);
    if(!isValid){
        return res.status(403).send("The request format is not valid");
    }
    updateCustomer(req.params.id, req.body)
    .then( updatedCustomer =>{
        return res.send(updatedCustomer);
    })
    .catch( err =>{
        return res.status(403).send(err);
    })

});

router.delete('/:id', auth,(req, res) =>{
    const isValid = validate(req.body);
    if(!isValid){
        return res.status(403).send("The request format is not valid");
    } 
    deleteCustomer(req.params.id)
    .then(result => {res.send(result)})
    .catch(err => { res.status(403).send(err)});   
});


//----------------export------------
module.exports = router;
