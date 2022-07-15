const express = require('express');
const router = express.Router();

const {
  checkExistUser,
  addNewUser,
  getAllUsers,
} = require('../controllers/user.controller');

router.get('/check', checkExistUser);
router.get('/add', addNewUser);
router.get('/all', getAllUsers);

module.exports = router;
