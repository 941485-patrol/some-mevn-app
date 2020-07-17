var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CheckAnimalId = require('../validators/checkAnimalId');
var TypeNameExists = require('../validators/typeNameExists');
var TypeEnvExists = require('../validators/typeEnvExists');
var typeSchema = new Schema({
    name: {
        type:String, 
        default:null,
        required:[true, 'Type name is required.'],
        maxlength:50,
        minlength:[2, 'No type has one letter...'],
        trim:true,
    },
    environment:{
        type:String, 
        default:null,
        required:[true, 'Environment of animal is required.'],
        maxlength:100,
        minlength:[5, 'No environment has one letter...'],
        trim:true,
    },
    created_at:{type:Date, default:Date.now},
    updated_at:{type:Date, default:Date.now},
    animal_ids: [{
        type: Schema.Types.ObjectId, 
        ref:'Animal',
    }],
});
var Type = mongoose.model('Type', typeSchema);
typeSchema.path('name').validate(TypeNameExists,'Type name already exists.');
typeSchema.path('environment').validate(TypeEnvExists,'Type environment already exists.');
typeSchema.path('animal_ids').validate(CheckAnimalId,'An Animal ID does not exist.');
module.exports = Type;