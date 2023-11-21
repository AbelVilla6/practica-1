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
    name: 'Xiaomi Redmi Note 12 Pro',
    price: 221,
    img: '/img/xiaomi-note12.webp',
    color: 'Black',
    description: 'Immerse yourself in the extraordinary capabilities of the Xiaomi Redmi Note 12 Pro with an impressive 8GB RAM, extensive 256GB storage, and a stunning 6.67-inch display in Midnight Black. This powerhouse device ensures seamless multitasking, ample storage for your content, and a captivating visual experience. The advanced features of the Redmi Note 12 Pro, combined with its sleek Midnight Black design, make it a standout choice for those seeking cutting-edge performance and style. Elevate your mobile experience with the Xiaomi Redmi Note 12 Pro!',
    operative_system: 'Android 5.0',
    technology: '4G',
  },
  {
    name: 'Apple iPhone 15',
    price: 959,
    img: '/img/Apple_iPhone_15.webp',
    color: 'Black',
    description: 'Explore the cutting-edge features of the Apple iPhone 15 (128 GB) in sleek black. This high-performance device boasts ample storage with 128 GB to cater to your multimedia demands. Capture extraordinary moments with its advanced camera system, revel in the lightning-fast 5G connectivity, and experience the unparalleled power of the A15 Bionic chip. The iPhone 15 in black is not just a phone; it is a fusion of style and state-of-the-art technology. Elevate your mobile experience with the iPhone 15!',
    operative_system: 'IOS 16',
    technology: '5G',
  },
  {
    name: 'Apple iPhone 12',
    price: 669,
    img: '/img/IPhone12.webp',
    color: 'Red',
    description: 'Discover the exceptional performance of the Apple iPhone 12 (64 GB) in its vibrant red color. This powerful device offers 64 GB of storage to meet your multimedia needs and captures unforgettable moments with its advanced camera system. Experience the speed of 5G, the power of the A14 Bionic chip, and the quality of the Super Retina XDR display. The red iPhone 12 is more than just a phone; it is an expression of style and cutting-edge technology. Make a bold statement with the iPhone 12!',
    operative_system: 'IOS 16',
    technology: '4G',
  },
  {
    name: 'Smartphone Xiaomi Redmi 12C',
    price: 111,
    img: '/img/Xiaomi-Redmi12C.webp',
    color: 'Graphite Gray',
    description: 'Discover the Xiaomi Redmi 12C, a feature-packed smartphone in Graphite Gray, offering a smooth performance with 4GB RAM, generous 128GB storage, and a captivating 6.71-inch display. This sleek device combines powerful capabilities with a stylish Graphite Gray finish, ensuring you have ample space for your data and a visually immersive experience. The Xiaomi Redmi 12C is your go-to choice for a reliable and elegant smartphone that effortlessly blends performance and design. Elevate your mobile journey with the Xiaomi Redmi 12C!',
    operative_system: 'Android',
    technology: '4G',
  },
  {
    name: 'Samsung Galaxy M13',
    price: 146,
    img: '/img/Sansung_galasy_M13.webp',
    color: 'Green',
    description: 'Experience the Samsung Galaxy M13, a dynamic smartphone in a refreshing Green hue, featuring 4GB RAM and a spacious 64GB storage capacity. With its vibrant 6.4-inch display, this device delivers a stunning visual experience. The Galaxy M13 combines style and efficiency, ensuring smooth multitasking and ample space for your content. Step into a world of possibilities with the Samsung Galaxy M13 in Green – where performance meets aesthetics, providing you with a delightful and reliable mobile companion. Elevate your smartphone experience with the Galaxy M13!',
    operative_system: 'Android 11.0',
    technology: '4G',
  },
  {
    name: 'UMIDIGI C2 Android 13',
    price: 68,
    img: '/img/UMIDIGI_C2_Android_13.webp',
    color: 'Black',
    description: 'Introducing the UMIDIGI C2, an Android 13 smartphone that seamlessly combines performance and versatility. With 3GB RAM and dual SIM 4G capability, this device ensures smooth multitasking and reliable connectivity. The UMIDIGI C2 is designed to keep up with your dynamic lifestyle, offering the latest Android experience and the convenience of dual SIM functionality. Stay connected, enjoy enhanced performance, and explore the possibilities with the UMIDIGI C2 – your reliable companion for the modern mobile experience.',
    operative_system: 'Android 13.0',
    technology: '4G',
  },
  {
    name: '8849 Tank 2',
    price: 629,
    img: '/img/8849Tank2.webp',
    color: 'Black',
    description: 'Introducing the 8849 Tank 2, a robust Android 13 smartphone that redefines endurance and performance. Boasting an impressive 22GB RAM and a whopping 256GB storage capacity, this device ensures seamless multitasking and ample space for your data. With a massive 15500mAh battery, the 8849 Tank 2 goes the distance, keeping you powered throughout your day. This rugged yet powerful smartphone is designed to meet the demands of modern users who require durability, extensive storage, and long-lasting battery life. Unleash the potential of the 8849 Tank 2 – your ultimate companion for a reliable and powerful mobile experience.',
    operative_system: 'Android 13.0',
    technology: '4G',
  },
  {
    name: 'Apple iPhone 14',
    price: 789,
    img: '/img/iphone14.webp',
    color: 'Black',
    description: 'Introducing the Apple iPhone 14 in sleek Black, a powerful device that combines style with cutting-edge technology. Featuring ample storage with 128 GB, this iPhone ensures you have space for all your photos, videos, and apps. The iPhone 14 is designed to deliver a seamless and immersive experience, equipped with advanced features and the iconic Apple performance. Elevate your mobile experience with the sophistication of the iPhone 14 in Black – a statement of both elegance and innovation.',
    operative_system: 'IOS 16',
    technology: '5G',
  },
  {
    name: 'Apple iPhone 8',
    price: 230,
    img: '/img/Iphone8.webp',
    color: 'Silver',
    description: 'Meet the Apple iPhone 8 in a stunning Silver finish, a device that effortlessly blends style with impressive functionality. With a generous 256GB of storage, this iPhone ensures you have ample space for your photos, apps, and more. The iPhone 8 features a sleek design and powerful performance, making it an ideal companion for your daily tasks and entertainment needs. Elevate your mobile experience with the timeless elegance and advanced capabilities of the iPhone 8 in Silver.',
    operative_system: 'IOS',
    technology: '3G',
  },
  {
    name: 'Xiaomi Redmi 10',
    price: 117,
    img: '/img/Xiaomi_Redmi_10.webp',
    color: 'Carbon Gray',
    description: 'Introducing the Xiaomi Redmi 10 (2022) - a feature-packed smartphone in Carbon Gray, offering a seamless experience with 4GB RAM, ample 128GB storage, and the convenience of Dual SIM functionality. This device combines powerful performance with a sleek design, ensuring you have the storage and flexibility you need for your digital life. Elevate your mobile experience with the Xiaomi Redmi 10, where style meets efficiency in the sophisticated Carbon Gray color.',
    operative_system: 'Android 11.0',
    technology: '4G',
  },
  {
    name: 'Xiaomi POCO M5',
    price: 209,
    img: '/img/Xiaomi_Poco.webp',
    color: 'Black',
    description: 'Introducing the Xiaomi POCO M5 – a cutting-edge smartphone featuring 4GB RAM and a spacious 128GB storage capacity. With its vibrant FHD+ DotDrop display and powered by the MediaTek Helio G99 processor, this device delivers a seamless and immersive user experience. The POCO M5 is designed for efficiency and endurance, boasting a robust 5000mAh battery to keep you powered throughout the day. With the added convenience of NFC technology, the POCO M5 brings a new level of functionality to your mobile experience. Elevate your smartphone journey with the Xiaomi POCO M5 – where performance meets innovation.',
    operative_system: 'MIUI 12',
    technology: '4G',
  },
  {
    name: 'SAMSUNG Galaxy A54 5G',
    price: 409,
    img: '/img/samsung_A54.webp',
    color: 'Violet',
    description: 'Meet the SAMSUNG Galaxy A54 5G, a powerful Android smartphone with 128GB of storage and an impressive 8GB of RAM. This device ensures a smooth and responsive experience for multitasking and app usage. With its robust 5000mAh battery, the Galaxy A54 5G provides long-lasting power, keeping you connected throughout your day. Enjoy the speed and efficiency of 5G connectivity, combined with the reliability and innovation that Samsung is known for. Elevate your mobile experience with the Galaxy A54 5G – where performance and convenience seamlessly come together.',
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