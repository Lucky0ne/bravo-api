/**
 * Created by igorgo on 18.06.2017.
 */
var express = require('express');
var router = express.Router();

router.get('/get-main-menu',require('./api/menu'));

module.exports = router;