const Status = require('../../models/status');
const serializeStatus = require('./serializeStatus');
const errmsg = require('../../errmsg');
const getStatuses = async function(req, res, next){
    try {
        var statuses = await Status.find().populate('animal_ids');
        if (statuses.length == 0) {
            res.status(200).json({'message': 'No data.'});
        } else {
            var statusArr = [];
            statuses.forEach((status)=>{
                var statusObj = serializeStatus(status);
                statusArr.push(statusObj);
            });
            res.status(200).json(statusArr);
        }
    } catch (error) {
        errmsg(error, res);
    }
    
};
module.exports = getStatuses;