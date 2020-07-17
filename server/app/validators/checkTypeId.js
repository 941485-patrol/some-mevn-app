const checkTypeId = async (value) => {
    const Type = require('../models/type');
    return await Type.exists({_id:value});
} 
module.exports = checkTypeId;