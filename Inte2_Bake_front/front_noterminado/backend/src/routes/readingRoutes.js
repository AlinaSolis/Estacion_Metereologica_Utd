const express = require('express');
const ctrl = require('../controllers/readingController');
const auth = require('../middlewares/apiKeyAuth');

const router = express.Router();

router.post('/', auth, ctrl.postReading);
router.get('/', ctrl.getReadings);
router.get('/latest', ctrl.getLatest);

//crud bd
router.get('/:id', ctrl.getReading);
router.put('/:id', auth, ctrl.updateReading);
router.delete('/:id', auth, ctrl.deleteReading);

module.exports = router;