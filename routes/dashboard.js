﻿var express = require('express');
var router = express.Router();

/* GET Dashboard page. */
router.get('/', function (req, res) {
    res.render('dashboard', { title: 'Dashboard' });
});

module.exports = router;
