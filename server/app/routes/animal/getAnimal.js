const Animal = require('../../models/animal');
const Errormsg = require('../../errmsg');
const serializeAnimal = require('./serializeAnimal');
const mongoose = require('mongoose');
const getAnimal = async (req, res, next)=>{
  try {
    if( mongoose.isValidObjectId(req.params.id) === false ) throw new Error('Invalid Url.');
    var animal = await Animal.findOne({_id : req.params.id}).populate('type_id').populate('status_id');
    if (animal==null) throw new Error("Cannot find animal.");
    var animalObj = serializeAnimal(animal);
    res.status(200).json(animalObj);
  } catch (error) {
    Errormsg(error, res);
  }
}
module.exports = getAnimal;