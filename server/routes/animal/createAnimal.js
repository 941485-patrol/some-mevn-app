const Animal = require('../../models/animal');
const Type = require('../../models/type');
const Errormsg = require('../../errmsg');
var updateValidation = { runValidators: true };
const createAnimal = async (req, res, next ) => {
  try {
    var animal = new Animal 
    ({
      name: req.body.name,
      description: req.body.description, 
      type_id: req.body.type_id,
    });
    await animal.save();
    var updateType = await Type.updateOne({_id: animal.type_id},{'$push': {animal_ids: animal._id}},updateValidation);
    if (updateType.nModified == 0) throw new Error("Error adding type id.");
    res.status(200).json({"message": "Animal created"});
  } catch (error) {
    Errormsg(error, res);
  }
}
module.exports = createAnimal;