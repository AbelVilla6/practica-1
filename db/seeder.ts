import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import Orders, { Order } from '@/models/Order';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
  {
    name: 'Xiaomi Redmi Note 12',
    price: 221,
    img: '/img/xiaomi-note12.png',
    color: 'Black',
    description: 'Xiaomi Redmi Note 12 Pro 8GB/ 256GB/ 6.67"/ Negro Medianoche',
    operative_system: 'Android 5.0',
    technology: '4G',
  },
  {
    name: 'Apple iPhone 15',
    price: 959,
    img: 'https://m.media-amazon.com/images/I/81NDDPNpt4L._AC_UF894,1000_QL80_.jpg',
    color: 'Black',
    description: 'Apple iPhone 15 (128 GB) - Negro',
    operative_system: 'IOS 16',
    technology: '5G',
  },
  {
    name: 'Apple iPhone 12',
    price: 669,
    img: 'https://m.media-amazon.com/images/I/71vKy5OHuPL._AC_SL1500_.jpg',
    color: 'Red',
    description: 'Apple iPhone 12 (64 GB) - Red',
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
  
  const orders: Order[] = [
    {
    date: new Date('1970-01-01T00:00:00.000Z'),
    address: 'Unnamed Street 123, 12345 London,UK',
    cardHolder: 'John Doe',
    cardNumber: '0000111122223333',
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
  },
  {
    date: new Date('1970-01-01T00:00:00.000Z'),
    address: 'Another address 456, 45678 London,UK',
    cardHolder: 'John Doe',
    cardNumber: '4455667788990011',
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
  }
]

  const insertedOrder = await Orders.create(orders);
  console.log(JSON.stringify(insertedOrder, null, 2));

  const user: User[] = [{
    email: 'johndoe@example.com',
    password: await bcrypt.hash("1234", 10),
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
    orders: [    
        insertedOrder[0]._id,
        insertedOrder[1]._id,
    ],
  },
  {
    email: 'foobar@example.com',
    password: await bcrypt.hash("12345", 10),
    name: 'Foo',
    surname: 'Bar',
    address: 'Unnamed Street 123, 12345 London,UK',
    birthdate: new Date('1970-01-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
      },
    ],
    orders: [    
        
    ],
  }];

  const insertedUser = await Users.create(user);
  console.log(JSON.stringify(insertedUser, null, 2));

  const retrievedUser = await Users
  .findOne({ email: 'johndoe@example.com' })
  .populate('cartItems.product');
  console.log(JSON.stringify(retrievedUser, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);