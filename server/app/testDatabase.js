const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost/${process.env.TEST_DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

module.exports = mongoose;