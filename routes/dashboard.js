var express = require('express');
var router = express.Router();

/* GET Dashboard page. */
router.get('/:env/:farm', function (req, res) {
    res.render('dashboard', { title: 'Dashboard', header: req.params.env, subHeader: req.params.farm });
});

module.exports = router;
