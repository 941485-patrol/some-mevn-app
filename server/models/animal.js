var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CheckTypeId = require('../validators/checkTypeId');
var CheckAnimalId = require('../validators/checkAnimalId');
var animalSchema = new Schema({
    name: {
        type:String, 
        default:null,
        required:[true, 'Animal name is required.'],
        maxlength:50,
        minlength:[2, 'No animal has one letter...'],
    },
    description:{
        type:String, 
        default:null,
        required:[true, 'Description of animal is required.'],
        maxlength:255,
        minlength:[5, 'Description is too short...'],
    },
    created_at:{type:Date, default:Date.now},
    updated_at:{type:Date, default:Date.now},
    type_id:{
        type:Schema.Types.ObjectId, 
        ref:'Type',
    },
});
var Animal = mongoose.model('Animal', animalSchema);
// animalSchema.path('_id').validate(CheckAnimalId,'Wrong id.');
animalSchema.path('type_id').validate(CheckTypeId,'Wrong type id.');
module.exports = Animal;