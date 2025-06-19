const express = require('express');
const router = express.Router();
const { createWarehouse, getAllWarehouses, getWarehouseById,
    updateWarehouse,
    deleteWarehouse, } = require('../controllers/warehouseController');

router.post('/newWh', createWarehouse);
router.get('/', getAllWarehouses);
router.get('/:id', getWarehouseById);
router.put('/:id', updateWarehouse);
router.delete('/:id', deleteWarehouse);

module.exports = router;
