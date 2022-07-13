const express = require('express');
const router = express.Router();

const {
  checkExistUser,
  addNewUser,
} = require('../controllers/user.controller');

router.get('/check', checkExistUser);
router.post('/add', addNewUser);

module.exports = router;
