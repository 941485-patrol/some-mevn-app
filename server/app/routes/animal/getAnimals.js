const Animal = require('../../models/animal');
const serializeAnimal = require('./serializeAnimal');
const Errormsg = require('../../errmsg');
const pageAnimals = require('./pageAnimals');
const searchAnimals = require('./searchAnimals');
const sortAnimals = require('./sortAnimals');

const getAnimals = async (req, res, next)=>
  {
    try {
      var page = pageAnimals(req);
      pageSkip = parseInt(page) - parseInt(1);
      var perPage = 5;
      var sort = sortAnimals(req);
      var searchee = searchAnimals(req);
      var animals = await Animal.find(searchee)
        .populate('type_id').populate('status_id')
        .skip(pageSkip*perPage).limit(perPage)
        .sort(sort);
      var animalCount = await Animal.find().estimatedDocumentCount();
      var totalPages = Math.ceil(parseInt(animalCount)/perPage);
      if (animals.length == 0) {
        var animalRes = {}
        animalRes['results'] = {'message': 'No data.' }; 
        res.status(200).json(animalRes);
      } else {
        var animalRes = {};
        var animalsArr = [];
        animals.forEach(animal=>{
          var animalObj = serializeAnimal(animal);
          animalsArr.push(animalObj);
        })
        animalRes['totalPages'] = totalPages;
        animalRes['_this'] = req.originalUrl;
        animalRes['hasNext'] = page < totalPages ? true : false;
        animalRes['hasPrev'] = page != 1 ? true : false;
        animalRes['results'] = animalsArr;
        res.status(200).json(animalRes);
      }
    } catch (error) {
      Errormsg(error, res);
    }
  }
module.exports = getAnimals;