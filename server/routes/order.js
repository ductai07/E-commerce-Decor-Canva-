const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const { 
    createOrder, 
    getUserOrders, 
    getOrderById, 
    updateOrderStatus, 
    updatePaymentStatus, 
    cancelOrder, 
    getAllOrders 
} = require('../controllers/order');

// User routes
router.post('/', verifyAccessToken, createOrder);
router.get('/user', verifyAccessToken, getUserOrders);
router.get('/:id', verifyAccessToken, getOrderById);
router.put('/:id/cancel', verifyAccessToken, cancelOrder);

// Admin routes
router.get('/', verifyAccessToken, isAdmin, getAllOrders);
router.put('/:id/status', verifyAccessToken, isAdmin, updateOrderStatus);
router.put('/:id/payment', verifyAccessToken, isAdmin, updatePaymentStatus);

module.exports = router;