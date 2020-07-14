const animalDescExists = async function(value, args) {
    var Animal = require('../models/animal')
    if (this._conditions != undefined) {
        var animalCount = await Animal.findOne({_id:{'$ne': this._conditions._id}, description: new RegExp(value,'i')});
        if (animalCount != null) return false;
    } else {
        var animalCount = await Animal.findOne({description: new RegExp(value,'i')});
        if (animalCount != null) return false;
    }

};
module.exports = animalDescExists;