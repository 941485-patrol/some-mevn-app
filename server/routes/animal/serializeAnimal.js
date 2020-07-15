const serializeAnimal = (animal)=>{
  var typeObj = null;
  if (animal.type_id != null) {
    typeObj = {
      'type_id': animal.type_id._id,
      'name': animal.type_id.name,
      'environment': animal.type_id.environment,
      'created_at': animal.type_id.created_at,
      'updated_at': animal.type_id.updated_at,
    }
  }
    var animalObj = {
        '_id': animal._id,
        'name': animal.name,
        'description': animal.description,
        'created_at': animal.created_at,
        'updated_at': animal.updated_at,
        'type': typeObj,
    }
    return animalObj;
}
module.exports = serializeAnimal;