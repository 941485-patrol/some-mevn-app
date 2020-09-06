const mongoose = require('mongoose');

mongoose.connect(`${process.env.MONGODB_URI_DEV}`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

module.exports = mongoose;