const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Shirts', 'T-Shirts', 'Hoodies', 'Jackets', 'Formal Wear', 'Track Pants', 'Cotton Pants', 'Trousers', 'Innerwear'],
    },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    images: [{ type: String }],
    sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] }],
    colors: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    brand: { type: String, default: "Mens Zone" },
    material: { type: String, default: '' },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
