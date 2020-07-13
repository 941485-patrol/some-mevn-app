var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CheckAnimalId = require('../validators/checkAnimalId');
var CheckTypeId = require('../validators/checkTypeId');
var typeSchema = new Schema({
    name: {
        type:String, 
        default:null,
        required:[true, 'Type name is required.'],
        maxlength:50,
        minlength:[2, 'No type has one letter...'],
    },
    environment:{
        type:String, 
        default:null,
        required:[true, 'Environment of animal is required.'],
        maxlength:100,
        minlength:[5, 'No environment has one letter...'],
    },
    created_at:{type:Date, default:Date.now},
    updated_at:{type:Date, default:Date.now},
    animal_ids: [{
        type: Schema.Types.ObjectId, 
        ref:'Animal',
    }],
});
var Type = mongoose.model('Type', typeSchema);
// typeSchema.path('_id').validate(CheckTypeId,'Wrong id');
typeSchema.path('animal_ids').validate(CheckAnimalId,'Wrong animal ids.');
module.exports = Type;