const Animal = require('../../models/animal');
const Type = require('../../models/type');
const Errormsg = require('../../errmsg');
const mongoose = require('mongoose');
const updateAnimal = async (req, res, next) => {
  try {
    if( mongoose.isValidObjectId(req.params.id) === false ) throw new Error('Invalid Url.');
    if( mongoose.isValidObjectId(req.body.type_id) === false ) throw new Error('Invalid Type ID.');
    var animal = await Animal.findOne({_id: req.params.id});
    if ( animal == null ) throw new Error('Cannot find animal');
    animal.name = req.body.name;
    animal.description = req.body.description;
    animal.type_id = req.body.type_id;
    animal.updated_at = Date.now();
    var updatedAnimal = await animal.save();
    var pullType = await Type.findOne({animal_ids: req.params.id});
    if ( pullType != null ) pullType.animal_ids.pull(req.params.id);
    var pushType = await Type.findOne({_id: updatedAnimal.type_id});
    pushType.animal_ids.push(req.params.id);
    await pullType.save({validateBeforeSave: false});
    await pushType.save({validateBeforeSave: false});
    res.redirect(301, req.originalUrl);
  } catch (error) {
    Errormsg(error, res);
  } 
}
module.exports = updateAnimal;