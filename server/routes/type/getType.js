const Type = require('../../models/type');
const Errormsg = require('../../errmsg');
const serializeType = require('./serializeType');
const getType = async (req, res, next)=>{

  try {
    var type = await Type.findOne({_id : req.params.id}).populate('animal_ids');
    if (type==null) throw new Error("Wrong id");
    var typeObj = serializeType(type);
    res.status(200).json(typeObj);
  } catch (error) {
    Errormsg(error, res);
  }
}
module.exports = getType;