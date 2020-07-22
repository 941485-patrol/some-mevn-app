const Animal = require('../../models/animal');
const Type = require('../../models/type');
const Status = require('../../models/status');
const Errormsg = require('../../errmsg');
const mongoose = require('mongoose');
const createAnimal = async (req, res, next ) => {
  try {
    if ( mongoose.isValidObjectId(req.body.type_id) === false ) throw new Error('Invalid Type ID.');
    if ( mongoose.isValidObjectId(req.body.status_id) === false ) throw new Error('Invalid Status ID.');
    var animal = new Animal ({
      name: req.body.name,
      description: req.body.description, 
      type_id: req.body.type_id,
      status_id: req.body.status_id,
    });
    await animal.save();
    var type = await Type.findOne({_id: animal.type_id});
    type.animal_ids.push(animal._id);
    await type.save({validateBeforeSave: false});
    var status = await Status.findOne({_id: animal.status_id});
    status.animal_ids.push(animal._id);
    await status.save({validateBeforeSave: false});
    res.status(200).json({"message": "Animal created"});
  } catch (error) {
    Errormsg(error, res);
  }
}
module.exports = createAnimal;