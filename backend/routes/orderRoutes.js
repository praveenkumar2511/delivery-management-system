const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

//Delete all orders
router.delete('/clear-orders', orderController.deleteAllOrder);

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/newOrder', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

router.post("/allocate-orders", orderController.allocateOrdersController);
router.patch("/:id/receive", orderController.markAsReceived);
router.patch("/:id/deliver", orderController.markAsDelivered);

//seed oredrs
router.post('/seed-orders',orderController.createFakeOrders)
module.exports = router;
