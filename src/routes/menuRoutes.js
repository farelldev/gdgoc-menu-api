const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/menuController');

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/group-by-category', ctrl.groupByCategory);
router.get('/search', ctrl.search);
router.get('/:id', ctrl.get);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);
// AI helper
router.post('/ai/generate-description', ctrl.generateDescription);

module.exports = router;