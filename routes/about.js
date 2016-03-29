/**
 * Created by glendex on 3/28/16.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('about');
});

module.exports = router;