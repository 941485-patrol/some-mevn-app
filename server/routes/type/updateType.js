const Animal = require('../../models/animal');
const Type = require('../../models/type');
const Errormsg = require('../../errmsg');
var updateValidation = { runValidators: true };

const updateType = async (req, res, next) => {
    try {
        var update = {
            name: req.body.name,
            environment: req.body.environment, 
            updated_at: Date.now(),
        };
        var updatedAnimal = await Type.updateOne({_id:req.params.id}, update, updateValidation);
        if (updatedAnimal.nModified == 0) throw new Error("Wrong id.");
        res.redirect(301, req.originalUrl);
    } catch (error) {
        Errormsg(error, res);
    }
}
module.exports = updateType;