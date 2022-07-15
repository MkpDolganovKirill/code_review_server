const express = require('express');
const router = express.Router();

const {
  getRepositoryDiffFromUser,
  addNewRepository,
  updateRepositorySettings,
} = require('../controllers/repository.controller');

router.post('/diff/get', getRepositoryDiffFromUser);
router.post('/project/add', addNewRepository);
router.post('/project/update', updateRepositorySettings);

module.exports = router;
