const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
        name: String,
        price: Number,
        qty: { type: Number, min: 1, required: true },
      },
    ],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
