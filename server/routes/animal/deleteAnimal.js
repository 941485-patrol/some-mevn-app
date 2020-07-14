const Animal = require('../../models/animal');
const Type = require('../../models/type');
var updateValidation = {runValidators:true, context: 'query'};

const deleteAnimal = async (req, res, next)=>{
  try {
    await Type.updateOne({animal_ids:req.params.id}, {'$pull': {animal_ids: req.params.id}}, updateValidation);
    var delAnimal = await Animal.deleteOne({_id:req.params.id});
    if (delAnimal.deletedCount != 1) throw new Error('Error deleting data.');
    res.status(200).json({'message': 'Animal deleted.'});
  } catch (error) {
    res.status(400).json([error.message])
  }
}
module.exports = deleteAnimal;