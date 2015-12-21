'use strict';
let express = require('express');
let router = express.Router();

/* GET root route. */
router.get('/', (req, res) => {
  res.json({
    result: 'Root route',
  });
});
module.exports = router;
