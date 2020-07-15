const Animal = require('../../models/animal');
const Type = require('../../models/type');
const Errormsg = require('../../errmsg');
var updateValidation = {runValidators:true, context: 'query'};
const mongoose = require('mongoose');
const updateAnimal = async (req, res, next) => {
  try {
    if( mongoose.isValidObjectId(req.params.id) === false ) throw new Error('Invalid Url.');
    if( mongoose.isValidObjectId(req.body.type_id) === false ) throw new Error('Invalid Type ID.');
    var animal = await Animal.findOne({_id: req.params.id});
    if ( animal === null) throw new Error('Cannot find Animal.');
    animal.name = req.body.name;
    animal.description = req.body.name;
    animal.type_id = req.body.type_id;
    animal.updated_at = Date.now();
    var pullType = await Type.findOne({animal_ids: req.params.id});
    if ( pullType === null ) {
      var pushType = await Type.findOne({_id: req.params.id});
      pushType.animal_ids.push(req.params.id);
      await animal.save();
      await pushType.save({validateBeforeSave: false});
    } else {
      pullType.animal_ids.pull(req.params.id);
      var pushType = await Type.findOne({_id: req.params.id});
      pushType.animal_ids.push(req.params.id);
      var animal = Animal.findOne({_id: req.params.id});
      await animal.save();
      await pullType.save({validateBeforeSave: false});
      await pushType.save({validateBeforeSave: false});
    }
    res.redirect(301, req.originalUrl);
  } catch (error) {
    Errormsg(error, res);
  } 
}
module.exports = updateAnimal;