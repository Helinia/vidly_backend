const mongoose = require('mongoose');
const {genreSchema} = require('./genre');
const Joi = require('joi');




const movieSchema = mongoose.Schema({
    title: {type: String, required: true, trim: true, minlength: 5, maxlength: 255},
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock:{
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    };
    return Joi.validate(movie, schema);
}

module.exports.validate = validateMovie;
module.exports.Movie = Movie;