'use strict';
let express = require('express');
let router = express.Router();

/* GET /api/v1 return version */
router.get('/', (req, res) => {
  res.json({
    version: 'v1',
  });
});
module.exports = router;
