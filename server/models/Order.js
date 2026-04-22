const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
  size: String,
  color: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, default: () => 'MZ' + uuidv4().substring(0, 8).toUpperCase() },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ['Card', 'UPI', 'COD'], required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    promoCode: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    deliveredAt: { type: Date },
    cancellationRequest: {
      requested: { type: Boolean, default: false },
      reason: String,
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
      requestedAt: Date,
    },
    replacementRequest: {
      requested: { type: Boolean, default: false },
      reason: String,
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
      requestedAt: Date,
    },
    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
