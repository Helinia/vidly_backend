const mongoose = require('mongoose');
const Joi = require('joi');

// const genres = [
//     {id: 1, name: "Horror"},
//     {id: 2, name: "Love"}
// ];

const genreSchema = mongoose.Schema({
    name: {type: String, required: true, minlength: 5, maxlength: 50}
});

const Genre = mongoose.model('Genre', genreSchema);


function validateGenre(genre){
    const schema = {
        name: Joi.string().required()
    }
    return Joi.validate(genre, schema);
}
module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateGenre;