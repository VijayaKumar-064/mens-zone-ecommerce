require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const PromoCode = require('./models/PromoCode');

const products = [
  {
    name: 'Premium Oxford Formal Shirt',
    description: 'Crisp, elegant oxford shirt crafted from 100% premium cotton. Perfect for office meetings and formal events.',
    category: 'Shirts',
    price: 1299,
    discountPrice: 999,
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue', 'Navy'],
    stock: 50,
    material: '100% Cotton',
    isFeatured: true,
    tags: ['formal', 'office', 'shirt', 'cotton'],
    ratings: 4.5,
    numReviews: 12,
  },
  {
    name: 'Urban Graphic Tee',
    description: 'Bold urban-style graphic T-shirt made from soft combed cotton. Ideal for casual outings.',
    category: 'T-Shirts',
    price: 599,
    discountPrice: 449,
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Grey'],
    stock: 80,
    material: 'Combed Cotton',
    isTrending: true,
    tags: ['casual', 'graphic', 'tshirt'],
    ratings: 4.2,
    numReviews: 28,
  },
  {
    name: 'Fleece Pullover Hoodie',
    description: 'Warm and cozy fleece hoodie with kangaroo pocket. Perfect for cooler days and casual wear.',
    category: 'Hoodies',
    price: 1599,
    discountPrice: 1199,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'Navy', 'Olive'],
    stock: 35,
    material: 'Fleece Blend',
    isFeatured: true,
    isTrending: true,
    tags: ['hoodie', 'casual', 'warm', 'winter'],
    ratings: 4.7,
    numReviews: 45,
  },
  {
    name: 'Puffer Bomber Jacket',
    description: 'Stylish and lightweight puffer bomber jacket. Wind-resistant shell with insulated fill.',
    category: 'Jackets',
    price: 2999,
    discountPrice: 2499,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Olive Green', 'Navy'],
    stock: 20,
    material: 'Polyester Shell',
    isFeatured: true,
    tags: ['jacket', 'winter', 'bomber', 'outerwear'],
    ratings: 4.6,
    numReviews: 18,
  },
  {
    name: 'Slim Fit Formal Trousers',
    description: 'Tailored slim-fit trousers for a modern professional look. Wrinkle-resistant fabric.',
    category: 'Formal Wear',
    price: 1499,
    discountPrice: 1099,
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'Black', 'Navy'],
    stock: 40,
    material: 'Polyester Blend',
    isTrending: true,
    tags: ['trousers', 'formal', 'slim fit', 'office'],
    ratings: 4.3,
    numReviews: 22,
  },
  {
    name: 'DryFit Jogger Track Pants',
    description: 'High-performance dry-fit jogger pants with elastic waistband. Perfect for gym and sports.',
    category: 'Track Pants',
    price: 899,
    discountPrice: 699,
    images: ['https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Grey'],
    stock: 60,
    material: 'Polyester DryFit',
    isTrending: true,
    tags: ['gym', 'sports', 'jogger', 'track pants'],
    ratings: 4.4,
    numReviews: 33,
  },
  {
    name: 'Cotton Chino Pants',
    description: 'Versatile cotton chinos that transition seamlessly from office to weekend outings.',
    category: 'Cotton Pants',
    price: 1199,
    discountPrice: 899,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b984e?w=600'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Beige', 'Khaki', 'Olive', 'Navy'],
    stock: 45,
    material: '100% Cotton',
    isFeatured: true,
    tags: ['chino', 'casual', 'cotton', 'versatile'],
    ratings: 4.5,
    numReviews: 19,
  },
  {
    name: 'Regular Fit Casual Trousers',
    description: 'Comfortable regular-fit trousers with a relaxed silhouette. Great for everyday wear.',
    category: 'Trousers',
    price: 1099,
    discountPrice: 849,
    images: ['https://images.unsplash.com/photo-1540572516773-92b7389e5f91?w=600'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Dark Blue', 'Grey'],
    stock: 55,
    material: 'Cotton Blend',
    tags: ['trousers', 'casual', 'regular fit'],
    ratings: 4.1,
    numReviews: 14,
  },
  {
    name: 'SuperCombed Cotton Briefs (Pack of 3)',
    description: 'Ultra-soft supercombed cotton briefs with superior stretch and all-day comfort.',
    category: 'Innerwear',
    price: 599,
    discountPrice: 449,
    images: ['https://images.unsplash.com/photo-1565374395542-0ce18882c857?w=600'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Assorted'],
    stock: 100,
    material: 'SuperCombed Cotton',
    isFeatured: true,
    tags: ['innerwear', 'briefs', 'cotton', 'comfort'],
    ratings: 4.6,
    numReviews: 67,
  },
  {
    name: 'Striped Long Sleeve Shirt',
    description: 'Timeless classic striped long-sleeve shirt with a button-down collar. Casual yet refined.',
    category: 'Shirts',
    price: 1099,
    discountPrice: 849,
    images: ['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue-White', 'Red-White', 'Navy-White'],
    stock: 38,
    material: 'Cotton Blend',
    isTrending: true,
    tags: ['shirt', 'striped', 'casual', 'classic'],
    ratings: 4.3,
    numReviews: 16,
  },
  {
    name: 'Oversized Drop Shoulder Tee',
    description: 'Trendy oversized drop-shoulder T-shirt with a boxy fit. The ultimate streetwear essential.',
    category: 'T-Shirts',
    price: 799,
    discountPrice: 599,
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Sand', 'Dusty Pink'],
    stock: 75,
    material: 'Heavyweight Cotton 240gsm',
    isTrending: true,
    isFeatured: true,
    tags: ['oversized', 'tshirt', 'streetwear', 'unisex'],
    ratings: 4.8,
    numReviews: 54,
  },
  {
    name: 'Zip-Up Fleece Hoodie',
    description: 'Full zip-up fleece hoodie with two side pockets and a comfortable fit for year-round wear.',
    category: 'Hoodies',
    price: 1799,
    discountPrice: 1399,
    images: ['https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Heather Grey', 'Forest Green'],
    stock: 30,
    material: 'Fleece Blend',
    isFeatured: true,
    tags: ['hoodie', 'zip', 'fleece', 'casual'],
    ratings: 4.5,
    numReviews: 29,
  },
];

const promoCodes = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderAmount: 500, maxUses: 500 },
  { code: 'FLAT200', discountType: 'fixed', discountValue: 200, minOrderAmount: 1500, maxUses: 200 },
  { code: 'MENSZONE20', discountType: 'percentage', discountValue: 20, minOrderAmount: 2000, maxUses: 100 },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await PromoCode.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create manager
    const manager = await User.create({
      name: 'Admin Manager',
      email: 'manager@menszone.com',
      password: 'Admin@1234',
      role: 'manager',
      phone: '9999999999',
    });
    console.log(`✅ Manager created: ${manager.email}`);

    // Create sample customer
    await User.create({
      name: 'Raj Kumar',
      email: 'customer@menszone.com',
      password: 'Customer@123',
      role: 'customer',
      phone: '9876543210',
    });
    console.log('✅ Sample customer created: customer@menszone.com');

    // Create products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded`);

    // Create promo codes
    await PromoCode.insertMany(promoCodes);
    console.log(`✅ ${promoCodes.length} promo codes seeded`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📋 Manager Credentials:');
    console.log('   Email: manager@menszone.com');
    console.log('   Password: Admin@1234\n');
    console.log('📋 Customer Credentials:');
    console.log('   Email: customer@menszone.com');
    console.log('   Password: Customer@123\n');
    console.log('🎟️  Promo Codes: WELCOME10 | FLAT200 | MENSZONE20\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
