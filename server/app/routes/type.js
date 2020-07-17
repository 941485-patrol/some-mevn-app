var express = require('express');
var multer = require('multer');
var mongoose = require('mongoose');
const fetch = require('node-fetch');
var router = express.Router();
var upload = multer();

var Type = require('../models/type');
var Animal = require('../models/animal');

const createType = require('./type/createType');
const getTypes = require('./type/getTypes');
const getType = require('./type/getType');
const updateType = require('./type/updateType');
const deleteType = require('./type/deleteType');

router.route('/')
  .get((req, res, next)=>
  {
    getTypes(req, res, next);
  })
  .post(upload.none(), (req, res, next)=> 
  {
    createType(req, res, next);
  })

router.route('/:id')
  .get((req, res, next)=> 
  {
    getType(req, res, next);
  })
  .put(upload.none(), (req, res, next)=> {
    updateType(req, res, next);
  })
  .delete(upload.none(), (req, res, next)=> 
  {
    deleteType(req, res, next);
  })

module.exports = router;