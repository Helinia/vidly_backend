const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
//const asyncMiddleware = require('../middleware/async');
//--asyn functions interacting with database--------------------
async function getGenres(){
    const genres = await Genre.find();
    return genres;
}
async function createGenres(name){
    try{
        const genre = new Genre({
            name: name
        });
        
        return await genre.save();
    }catch(ex){
        console.error('error in creating new genre..');
        for(field in ex.errors){
            console.log(ex.errors[field].message);
        }
    }   
}



// async function findGenres(id){
//     return await Genre.find({
//         _id: id
//     });
// }

async function updateGenres(id,name){
    const updatedGenre = await Genre.findByIdAndUpdate(id,{
        $set:{
            name: name
        }
    }, {new: true});

    return updatedGenre;
}

//--route methods
router.get('/', async (req, res) =>{
    //throw new Error('Could not get the genres');
    const genres = await Genre.find().sort('name');
    res.send(genres);
    
});

router.get('/:id',validateObjectId, (req, res )=>{

    Genre.findById(req.params.id)
    .then(result =>{return res.send(result)})
    .catch(err => {return res.status(404).send(err)});
})
router.post('/', auth, (req,res)=>{


    const {error} = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }
    createGenres(req.body.name).then(result =>{
        //console.log(result);
        res.send(result);
    })
    .catch(err => {
        res.status(403).message("cannot create new genre..");
    });
});

router.put('/:id', auth, async (req, res)=> {
    console.log('PUT request starts...');
    const {error} = validate(req.body);
    if(error) {
        res.status(403).send("Genre name is not valid.");
        return;
    }
    updateGenres(req.params.id, req.body.name).then(updatedGenre =>{
        if(!updatedGenre) return res.status(404).send('Genre not found');
        return res.send(updatedGenre);
    })
    .catch(err => {return res.status(404).send("genre not found")});


    // const updatedGenre = await Genre.findByIdAndUpdate(req.params.id,{
    //     name: req.body.name
    // }, {new: true}).catch(err => {return res.status(404).send("Genre is not found in this PUT request.")});
    // if(!updatedGenre) return res.status(404).send("Genre is not found.");
    // return res.send(updatedGenre);




    // findGenres(parseInt(req.params.id)).then(found =>{
    //     console.log("length: ",found.count());
    //     if(found.count() > 0 && found){
    //         //only one object should be found
    //         updateGenres(parseInt(req.params.id), req.body.name)
    //         .then(updatedGenre =>{ res.send(updatedGenre)})
    //         .catch(err => console.error(err));
    //     }else{
    //         res.status(404).send('Genre not found.');
    //         return;
    //     }
    // })
    // .catch(err =>{
    //     console.error(err);
    // })

    //if the corresponding genre is found in db
    // const {error} = validateGenre(req.body);
    // if(error) {
    //     res.status(403).send("Genre name is not valid.");
    //     return;
    // }
    // found.name = req.body.name;
    // res.send(found);

})

router.delete('/:id', [auth, admin],async (req, res) =>{
    const isValid = validate(req.body);
    if(!isValid){
        return res.status(403).send("The request format is not valid");
    } 
    const genre = await Genre.findByIdAndRemove(req.params.id)
    .then(genre => {return res.send(genre)})
    .catch(error => {return res.status(403).send("some error in DELETE")});


})


module.exports = router;