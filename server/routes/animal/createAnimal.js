const Animal = require('../../models/animal');
const Type = require('../../models/type');
const Errormsg = require('../../errmsg');
const mongoose = require('mongoose');
const createAnimal = async (req, res, next ) => {
  try {
    if ( mongoose.isValidObjectId(req.body.type_id) === false ) throw new Error('Invalid Type ID.');
    var animal = new Animal ({
      name: req.body.name,
      description: req.body.description, 
      type_id: req.body.type_id,
    });
    var type = await Type.findOne({_id: req.body.type_id});
    if ( type === null ) throw new Error('Cannot find Type. Please create a Type or enter valid Type ID');
    type.animal_ids.push(req.body.type_id);
    await animal.save();
    await type.save({validateBeforeSave: false});
    res.status(200).json({"message": "Animal created"});
  } catch (error) {
    Errormsg(error, res);
  }
}
module.exports = createAnimal;