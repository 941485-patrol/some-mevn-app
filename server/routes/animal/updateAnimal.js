const Animal = require('../../models/animal');
const Type = require('../../models/type');
const Errormsg = require('../../errmsg');
var updateValidation = { runValidators: true };

const updateAnimal = async (req, res, next) => {
  try {
    var update = {
      name: req.body.name,
      description: req.body.description, 
      type_id: req.body.type_id,
      updated_at: Date.now(),
    };
    var pull = {'$pull': {animal_ids:req.params.id}};
    var push = {'$push': {animal_ids:req.params.id}};
    var updatedAnimal = await Animal.updateOne({_id:req.params.id}, update, updateValidation);
    if (updatedAnimal.nModified == 0) throw new Error("Wrong id");
    await Type.updateOne({animal_ids: req.params.id}, pull);
    await Type.updateOne({_id: update.type_id}, push);
    res.redirect(301, req.originalUrl);
  } catch (error) {
    Errormsg(error, res);
  } 
}
module.exports = updateAnimal;