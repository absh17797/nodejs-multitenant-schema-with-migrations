const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.get('/', vehicleController.getAll);
router.post('/', vehicleController.create);

module.exports = router;