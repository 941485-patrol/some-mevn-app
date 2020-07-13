const Animal = require('../../models/animal');
const Type = require('../../models/type');
var updateValidation = { runValidators: true };

const deleteType = async (req, res, next)=>{
  try {
    var nullifyAnimal = await Animal.updateMany({type_id:req.params.id}, {type_id:null});
    if (nullifyAnimal.nModified == 0) throw new Error("Error deleting data.");
    var deleteType = await Type.deleteOne({_id:req.params.id});
    if (deleteType.deletedCount != 1) throw new Error('Error deleting data.');
    res.status(200).json({'message': 'Animal deleted.'});
  } catch (error) {
    res.status(400).json([error.message])
  }
}
module.exports = deleteType;