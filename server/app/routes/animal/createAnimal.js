const Animal = require('../../models/animal');
const Type = require('../../models/type');
const Errormsg = require('../../errmsg');
const mongoose = require('mongoose');
const createAnimal = async (req, res, next ) => {
  try {
    if ( mongoose.isValidObjectId(req.body.type_id) === false ) throw new Error('Invalid Type ID.');
    var animal = new Animal ({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      description: req.body.description, 
      type_id: req.body.type_id,
    });
    await animal.save();
    var type = await Type.findOne({_id: animal.type_id});
    type.animal_ids.push(animal._id);
    await type.save({validateBeforeSave: false});
    res.status(200).json({"message": "Animal created"});
  } catch (error) {
    Errormsg(error, res);
  }
}
module.exports = createAnimal;