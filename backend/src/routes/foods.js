const express = require('express');
const { body } = require('express-validator');
const Food = require('../models/Food');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const foodRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

// READ (public) - supports ?category=&search=
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
    res.json(await Food.find(filter).sort({ createdAt: -1 }));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  })
);

// CREATE / UPDATE / DELETE (admin only)
router.post(
  '/',
  protect,
  authorize('admin'),
  foodRules,
  validate,
  asyncHandler(async (req, res) => res.status(201).json(await Food.create(req.body)))
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  })
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Food deleted' });
  })
);

module.exports = router;
