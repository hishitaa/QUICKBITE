const express = require('express');
const { body } = require('express-validator');
const Order = require('../models/Order');
const Food = require('../models/Food');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const socket = require('../socket');

const router = express.Router();

const STATUSES = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

// Place an order. Prices are re-read from the DB so the client cannot tamper with them.
router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('Cart is empty'),
    body('items.*.food').notEmpty().withMessage('Food id required'),
    body('items.*.qty').isInt({ min: 1, max: 20 }).withMessage('Quantity must be 1-20'),
    body('address').trim().isLength({ min: 5 }).withMessage('Delivery address is required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const ids = req.body.items.map((i) => i.food);
    const foods = await Food.find({ _id: { $in: ids }, available: true });
    const byId = new Map(foods.map((f) => [String(f._id), f]));

    const items = req.body.items.map((i) => {
      const f = byId.get(String(i.food));
      if (!f) {
        const err = new Error('One or more items are unavailable');
        err.status = 400;
        throw err;
      }
      return { food: f._id, name: f.name, price: f.price, qty: Number(i.qty) };
    });

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      address: req.body.address,
    });

    socket.toAdmins('order:new', { id: order._id, total, by: req.user.name });
    res.status(201).json(order);
  })
);

router.get(
  '/mine',
  protect,
  asyncHandler(async (req, res) => {
    res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
  })
);

router.get(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 }));
  })
);

router.patch(
  '/:id/status',
  protect,
  authorize('admin'),
  [body('status').isIn(STATUSES).withMessage('Invalid status')],
  validate,
  asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    socket.toUser(order.user, 'order:update', { id: order._id, status: order.status });
    res.json(order);
  })
);

module.exports = router;
