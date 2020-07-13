const Animal = require('../../models/animal');
const Errormsg = require('../../errmsg');
const serializeAnimal = require('./serializeAnimal');
const getAnimal = async (req, res, next)=>{

  try {
    var animal = await Animal.findOne({_id : req.params.id}).populate('type_id');
    if (animal==null) throw new Error("Wrong id");
    var animalObj = serializeAnimal(animal);
    res.status(200).json(animalObj);
  } catch (error) {
    Errormsg(error, res);
  }
}
module.exports = getAnimal;