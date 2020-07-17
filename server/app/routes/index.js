var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.get('/', function(req, res, next) {
  res.send('hays MERN!')
});

router.get('/test', async function(req, res){
    let url = 'http://dummy.restapiexample.com/api/v1/employees';
    let response = await fetch(url);
    let result = await response.json();
    if (result.status == 'success')
    {
      res.send(JSON.stringify(result.data));
    }
});

module.exports = router;