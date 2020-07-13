var express = require('express');
var multer = require('multer');
var router = express.Router();
var upload = multer();
// const fetch = require('node-fetch');
var getAnimals = require('./animal/getAnimals');
var createAnimal = require('./animal/createAnimal');
var getAnimal = require('./animal/getAnimal');
var updateAnimal = require('./animal/updateAnimal');
var deleteAnimal = require('./animal/deleteAnimal');


router.route('/')
  .get((req, res, next)=>{
    getAnimals(req, res, next);
  })
  .post(upload.none(), (req, res, next)=> 
  {
    createAnimal(req, res, next);
  })

router.route('/single/:id')
  .get((req, res, next)=> 
  {
    getAnimal(req, res, next);
  })
  .put(upload.none(), (req, res, next)=> 
  {
    updateAnimal(req, res, next);
  })
  .delete(upload.none(), (req, res, next)=> 
  {
    deleteAnimal(req, res, next);
  })
module.exports = router;