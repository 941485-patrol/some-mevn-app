var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CheckTypeId = require('../validators/checkTypeId');
var AnimalNameExists = require('../validators/animalNameExists');
var AnimalDescExists = require('../validators/animalDescExists');

var animalSchema = new Schema({
    name: {
        type:String, 
        default:null,
        required:[true, 'Animal name is required.'],
        maxlength:50,
        minlength:[2, 'No animal has one letter...'],
        trim: true,
    },
    description:{
        type:String, 
        default:null,
        required:[true, 'Description of animal is required.'],
        maxlength:255,
        minlength:[5, 'Description is too short...'],
        trim: true,
    },
    created_at:{type:Date, default:Date.now},
    updated_at:{type:Date, default:Date.now},
    type_id:{
        type:Schema.Types.ObjectId, 
        ref:'Type',
    },
});
var Animal = mongoose.model('Animal', animalSchema);
// animalSchema.path('name').validate({validator: AnimalNameExists, model: Animal, message: 'Animal name already exists.', propsParameter: true})
animalSchema.path('name').validate(AnimalNameExists, 'Animal name already exists.');
animalSchema.path('description').validate(AnimalDescExists, 'Animal description already exists.');
animalSchema.path('type_id').validate(CheckTypeId,'Type ID does not exist.');
module.exports = Animal;