const sortStatuses = function(req) {
    var sort = req.query.sort == undefined ? '_id' : req.query.sort.toString();
    var sortFields = ['_id', 'name', 'description', 'animal_id', '-_id', '-name', '-description', '-animal_id']; 
    if (sortFields.includes(sort) == false) throw new Error('Invalid sort field.');
    return sort;
}
module.exports = sortStatuses;