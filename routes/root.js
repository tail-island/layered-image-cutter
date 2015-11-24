var express = require('express');
var router = express.Router();

router.get('/:layeredImageName', function(request, response, next) {
  response.render('layered-image-cutter', { title: 'try webGL', layeredImageName: request.params.layeredImageName });
});

module.exports = router;
