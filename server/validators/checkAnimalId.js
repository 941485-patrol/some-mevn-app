const checkTypeId = async (value) => {
    if (value=='') return true;
    var Animal = require('../models/animal');
    return await Animal.exists({_id:value})
}
module.exports = checkTypeId;