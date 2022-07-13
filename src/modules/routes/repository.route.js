const express = require('express');
const router = express.Router();

const {
  getRepositoryDiffFromUser,
} = require('../controllers/repository.controller');

router.post('/repository/diff/get', getRepositoryDiffFromUser);

module.exports = router;
