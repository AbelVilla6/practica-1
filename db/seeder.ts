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
    img: '/img/xiaomi-note12.webp',
    color: 'Black',
    description: 'Xiaomi Redmi Note 12 Pro 8GB/ 256GB/ 6.67"/ Negro Medianoche',
    operative_system: 'Android 5.0',
    technology: '4G',
  },
  {
    name: 'Apple iPhone 15',
    price: 959,
    img: '/img/Apple_iPhone_15.webp',
    color: 'Black',
    description: 'Apple iPhone 15 (128 GB) - Negro',
    operative_system: 'IOS 16',
    technology: '5G',
  },
  {
    name: 'Apple iPhone 12',
    price: 669,
    img: '/img/IPhone12.webp',
    color: 'Red',
    description: 'Apple iPhone 12 (64 GB) - Red',
    operative_system: 'IOS 16',
    technology: '4G',
  },
  {
    name: 'Smartphone Xiaomi Redmi 12C',
    price: 111,
    img: '/img/Xiaomi-Redmi12C.webp',
    color: 'Graphite Gray',
    description: 'Smartphone Xiaomi Redmi 12C 4GB/ 128GB/ 6.71"/ Graphite Gray',
    operative_system: 'Android',
    technology: '4G',
  },
  {
    name: 'Samsung Galaxy M13',
    price: 146,
    img: '/img/Sansung_galasy_M13.webp',
    color: 'Green',
    description: 'Samsung Galaxy M13 (64 GB) Green 4GB',
    operative_system: 'Android 11.0',
    technology: '4G',
  },
  {
    name: 'UMIDIGI C2 Android 13',
    price: 68,
    img: '/img/UMIDIGI_C2_Android_13.webp',
    color: 'Black',
    description: 'UMIDIGI C2 Android 13 Smartphone 3GB RAM Dual SIM 4G',
    operative_system: 'Android 13.0',
    technology: '4G',
  },
  {
    name: '8849 Tank 2',
    price: 629,
    img: '/img/8849Tank2.webp',
    color: 'Black',
    description: '8849 Tank 2 - Android 13, 22GB+256GB, 15500mAh',
    operative_system: 'Android 13.0',
    technology: '4G',
  },
  {
    name: 'Apple iPhone 14',
    price: 789,
    img: '/img/iphone14.webp',
    color: 'Black',
    description: 'Apple iPhone 14 (128 GB) - Black',
    operative_system: 'IOS 16',
    technology: '5G',
  },
  {
    name: 'Apple iPhone 8',
    price: 230,
    img: '/img/Iphone8.webp',
    color: 'Silver',
    description: 'Apple iPhone 8 256GB Silver',
    operative_system: 'IOS',
    technology: '3G',
  },
  {
    name: 'Xiaomi Redmi 10',
    price: 117,
    img: '/img/Xiaomi_Redmi_10.webp',
    color: 'Carbon Gray',
    description: 'Xiaomi Redmi 10 (2022) - Smartphone 128GB, 4GB RAM, Dual Sim, Carbon Gray',
    operative_system: 'Android 11.0',
    technology: '4G',
  },
  {
    name: 'Xiaomi POCO M5',
    price: 209,
    img: '/img/Xiaomi_Poco.webp',
    color: 'Black',
    description: 'Xiaomi POCO M5 - Smartphone of 4+128GB, FHD+ DotDrop MediaTek Helio G99, 5000mAh, NFC',
    operative_system: 'MIUI 12',
    technology: '4G',
  },
  {
    name: 'SAMSUNG Galaxy A54 5G',
    price: 409,
    img: '/img/samsung_A54.webp',
    color: 'Violet',
    description: 'SAMSUNG Galaxy A54 5G (128GB, 8GB de RAM) Smartphone Android 5000 mAh',
    operative_system: 'Android 13.0',
    technology: '5G',
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
  },
  {
    email: 'emptycart@example.com',
    password: await bcrypt.hash("123456", 10),
    name: 'Empty',
    surname: 'Cart',
    address: 'Empty Street 123, 12345 EmptyCity,EmptyLand',
    birthdate: new Date('1980-01-01'),
    cartItems: [],
    orders: [],
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