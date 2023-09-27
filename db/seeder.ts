import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import Orders, { Order } from '@/models/Order';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
  {
    name: 'Smartphone Xiaomi Redmi Note 12',
    price: 221,
    img: 'https://m.media-amazon.com/images/I/51O609vwqsL._AC_SX679_.jpg',
    color: 'Black',
    description: 'Smartphone Xiaomi Redmi Note 12 Pro 8GB/ 256GB/ 6.67"/ Negro Medianoche',
    operative_system: 'Android 5.0',
    technology: '4G',
  },
  {
    name: 'Apple iPhone 15',
    price: 959,
    img: 'https://m.media-amazon.com/images/I/71vKy5OHuPL._AC_SL1500_.jpg',
    color: 'Blue',
    description: 'Apple iPhone 15 (128 GB) - Azul',
    operative_system: 'IOS 16',
    technology: '4G',
  },
];

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = {
    bufferCommands: false,
  };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  await conn.connection.db.dropDatabase();

  const insertedProducts = await Products.insertMany(products);
  const user: User = {
    email: 'johndoe@example.com',
    password: '1234',
    name: 'John',
    surname: 'Doe',
    address: '123 Main St, 12345 New York, United States',
    birthdate: new Date('1970-01-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
      },
    ],
    orders: [],
  };

  const insertedUser = await Users.create(user);
  console.log(JSON.stringify(insertedUser, null, 2));
  const order: Order = {
    date: new Date(),
    address: '123 Main St, 12345 New York, United States',
    cardHolder: 'John Doe',
    cardNumber: '1234567812345678',
    orderItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
        price: insertedProducts[0].price,
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
        price: insertedProducts[1].price,
      },
    ],
    user: insertedUser._id

  };

  const insertedOrder = await Orders.create(order);
  console.log(JSON.stringify(insertedOrder, null, 2));


  const retrievedUser = await Users
  .findOne({ email: 'johndoe@example.com' })
  .populate('cartItems.product');
  console.log(JSON.stringify(retrievedUser, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);