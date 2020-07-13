const Type = require('../../models/type');
const Errormsg = require('../../errmsg');
const serializeType = require('./serializeType');
const getTypes = async (req, res, next)=>
  {
    try {
      var types = await Type.find().populate('animal_ids');
      if (types.length == 0) {
        res.status(200).json({'message': 'No data.'})
      }
      var typesArr = [];
      types.forEach(type => {
        var typeObj = serializeType(type);
        typesArr.push(typeObj);
      })
      res.status(200).json(typesArr);
    } catch (error) {
      Errormsg(error, res);
    }
  }
module.exports = getTypes;