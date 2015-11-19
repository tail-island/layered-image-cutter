var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('layered-image-cutter', { title: 'try webGL' });
});

module.exports = router;
