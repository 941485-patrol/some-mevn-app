var express = require("express");
var app = express();

var indexRouter = require('./routes/index');
var typeRouter = require('./routes/type');
var animalRouter = require('./routes/animal');
var statusRouter = require('./routes/status');
var mongoose = require('./testDatabase');

// Connect database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`Test Database ${process.env.TEST_DB_NAME} connected.`);
});

app.listen(process.env.PORT,()=>{ console.log(`Listening to test port ${process.env.TEST_PORT}`)});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.use('/api/type', typeRouter);
app.use('/api/status', statusRouter);
app.use('/api/animal', animalRouter);
module.exports = app;