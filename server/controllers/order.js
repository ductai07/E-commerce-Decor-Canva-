const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const asyncHandler = require('express-async-handler');

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
    const { items, shippingAddress, paymentMethod, subtotal, shipping, discount, total } = req.body;
    
    if (!items || !shippingAddress || !paymentMethod || !total) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }
    
    try {
        const newOrder = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shipping,
            discount,
            total,
            status: 'pending',
            timeline: [{
                status: 'pending',
                date: new Date(),
                message: 'Đơn hàng đã được tạo'
            }]
        });
        
        // Update product quantities and sold count
        for (const item of items) {
            if (item.product) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { quantity: -item.quantity, sold: item.quantity }
                });
            }
        }
        
        return res.status(201).json({
            success: true,
            order: newOrder
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all orders for a user
const getUserOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Check if the order belongs to the user or if the user is an admin
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }
        
        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update order status (admin only)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, message } = req.body;
    
    if (!status) {
        return res.status(400).json({
            success: false,
            message: 'Status is required'
        });
    }
    
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Update order status
        order.status = status;
        
        // Add to timeline
        order.timeline.push({
            status,
            date: new Date(),
            message: message || `Đơn hàng đã được cập nhật sang trạng thái ${getStatusText(status)}`
        });
        
        // If status is 'delivered', update payment status to 'paid' for COD orders
        if (status === 'delivered' && order.paymentMethod === 'cod' && order.paymentStatus !== 'paid') {
            order.paymentStatus = 'paid';
        }
        
        await order.save();
        
        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update payment status
const updatePaymentStatus = asyncHandler(async (req, res) => {
    const { paymentStatus } = req.body;
    
    if (!paymentStatus) {
        return res.status(400).json({
            success: false,
            message: 'Payment status is required'
        });
    }
    
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Update payment status
        order.paymentStatus = paymentStatus;
        
        // Add to timeline if payment is completed
        if (paymentStatus === 'paid') {
            order.timeline.push({
                status: order.status,
                date: new Date(),
                message: 'Thanh toán đã được xác nhận'
            });
        }
        
        await order.save();
        
        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Cancel order (user or admin)
const cancelOrder = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Check if the order belongs to the user or if the user is an admin
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }
        
        // Check if order can be cancelled (only pending or processing orders can be cancelled)
        if (order.status !== 'pending' && order.status !== 'processing') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel order at current status'
            });
        }
        
        // Update order status
        order.status = 'cancelled';
        
        // Add to timeline
        order.timeline.push({
            status: 'cancelled',
            date: new Date(),
            message: reason || 'Đơn hàng đã bị hủy'
        });
        
        // Return products to inventory
        for (const item of order.items) {
            if (item.product) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { quantity: item.quantity, sold: -item.quantity }
                });
            }
        }
        
        await order.save();
        
        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all orders (admin only)
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'firstname lastname email');
        
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Helper function to get status text
const getStatusText = (status) => {
    switch (status) {
        case 'pending':
            return 'Chờ xác nhận';
        case 'processing':
            return 'Đang xử lý';
        case 'shipping':
            return 'Đang giao hàng';
        case 'delivered':
            return 'Đã giao hàng';
        case 'cancelled':
            return 'Đã hủy';
        default:
            return 'Không xác định';
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getAllOrders
};