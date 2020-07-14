const typeEnvExists = async function(value, args) {
    var Type = require('../models/type')
    if (this._conditions != undefined) {
        var typeCount = await Type.findOne({_id:{'$ne': this._conditions._id}, environment: new RegExp(value,'i')});
        if (typeCount != null) return false;
    } else {
        var typeCount = await Type.findOne({environment: new RegExp(value,'i')});
        if (typeCount != null) return false;
    }

};
module.exports = typeEnvExists;