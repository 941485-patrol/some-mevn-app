var mongoose = require('mongoose');
const statusNameExists = require('../validators/statusNameExists');
const statusDescExists = require('../validators/statusDescExists');
var Schema = mongoose.Schema;
var statusSchema = new Schema({
    name: {
        type: String,
        default: null,
        required: [true, 'Status name is required.'],
        maxlength: [50, 'Status name is too long...'],
        minlength: [2, 'No status has one letter...'],
        trim: true,
    },
    description: {
        type:String,
        default: null, 
        required: [true, 'Status description is required.'],
        maxlength: [100, 'Status description is too long...'],
        minlength: [5, 'Status description is too short...'],
        trim: true,
    },
    created_at:{type:Date, default:Date.now},
    updated_at:{type:Date, default:Date.now},
    animal_ids: [{
        type: Schema.Types.ObjectId, 
        ref:'Animal',
    }],
});
var Status = mongoose.model('Status', statusSchema);
statusSchema.path('name').validate(statusNameExists, 'Status name already exists.');
statusSchema.path('description').validate(statusDescExists, 'Status description already exists.');
module.exports = Status;