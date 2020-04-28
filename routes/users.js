// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

// Log a user out
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/info', (req, res) => {
  res.json({ profile: req.user ? req.user.profile : null });
});

module.exports = router;
