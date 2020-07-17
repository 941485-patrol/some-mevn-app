const Animal = require('../../models/animal');
const serializeAnimal = require('./serializeAnimal');
const Errormsg = require('../../errmsg');
const getAnimals = async (req, res, next)=>
  {
    try {
      var animals = await Animal.find().populate('type_id');
      if (animals.length == 0) {
        res.status(200).json({'message': 'No data.'})
      } else {
        var animalsArr = [];
        animals.forEach(animal=>{
          var animalObj = serializeAnimal(animal);
          animalsArr.push(animalObj);
        })
        res.status(200).json(animalsArr);
      }
    } catch (error) {
      Errormsg(error, res);
    }
  }
module.exports = getAnimals;