import Products, { Product } from '@/models/Product';
import Orders, { Order } from '@/models/Order';
import connect from '@/lib/mongoose';
import Users, { User } from '@/models/User';
import { Types } from 'mongoose';

export interface ProductsResponse {
  products: Product[];
}

export async function getProducts(): Promise<ProductsResponse> {
  await connect();

  const productProjection = {
    name: true,
    price: true,
    img: true,
  };

  const products = await Products.find({}, productProjection);
  
  return {
    products: products,
  };
}
export interface OrdersResponse {
  orders : Order[];
}

export async function getOrders(): Promise<OrdersResponse> {
  await connect();

  const orderProjection = {
    date: true,
    address: true,
    cardHolder: true,
    orderItems: true, 
    user: true,
  };
  const orders = await Orders.find({}, orderProjection);
  
  return {
    orders: orders,
  };
}

export interface CreateUserResponse {
    _id: Types.ObjectId | string;
  }
  
  export async function createUser(user: {
    email: string;
    password: string;
    name: string;
    surname: string;
    address: string;
    birthdate: Date;
  }): Promise<CreateUserResponse | null> {
    await connect();
  
    const prevUser = await Users.find({ email: user.email });
  
    if (prevUser.length !== 0) {
      return null;
    }
  
    const doc: User = {
      ...user,
      birthdate: new Date(user.birthdate),
      cartItems: [],
      orders: [],
    };
  
    const newUser = await Users.create(doc);
  
    return {
      _id: newUser._id,
    };
  }
  export interface UserResponse {
    email: string;
    name: string;
    surname: string;
    address: string;
    birthdate: Date;
  }
  
  export async function getUser(userId: string): Promise<UserResponse | null> {
    await connect();
  
    const userProjection = {
      email: true,
      name: true,
      surname: true,
      address: true,
      birthdate: true,
    };
    const user = await Users.findById(userId, userProjection);
  
    if (user === null) {
      return null;
    }
  
    return user;
  }

  export interface ProductResponse {
    name: string;
    price: number;
    img: string;
    description: string;
  }
  export async function getProduct(productId: string): Promise<ProductResponse | null> {
    await connect();
  
    const productProjection = {
      name: true,
      price: true,
      img: true,
      description: true,
    };
    const product = await Products.findById(productId, productProjection);
  
    if (product === null) {
      return null;
    }
  
    return product;
  }

  export interface CartResponse {
    cartItems: [] | null;
  }
  interface CartItem {
    product:string,
    qty:number,
  }
  export async function getCartByUserId(userId: string): Promise<CartResponse | null> {
    await connect();
  
    const cartProjection = {
      _id: false,
      cartItems: true,      
    };
    const productProjection = {
      _id: true,
      name: true,
      price: true,      
    };
    const cartItemsId = await Users.findById(userId, cartProjection);
    if (!cartItemsId || !cartItemsId.cartItems) {
      return null;
    }
  
    const cartItemsPromises = cartItemsId.cartItems.map(async (cartItem: CartItem) => {
      const product = await Products.findById(cartItem.product, productProjection)
      return {
        product,
        qty: cartItem.qty
      };
    });
  
    // Wait for all promises to resolve
    const cartItems = await Promise.all(cartItemsPromises);
  
    return { cartItems };
  }

  export interface ModifyCartResponse{
    status: number,
    cartItems: CartResponse | null,
  }

  export async function modifyCart(userId: string, productId: string, qty: number): Promise<ModifyCartResponse> {
    await connect();

    const user = await Users.findById(userId);
    if (!user) return {status:404, cartItems: null};
    const product = await Products.findById(productId)
    if (!product) return {status:404, cartItems: null};
  
    const productIndex = user.cartItems.findIndex((cartItem: CartItem) => cartItem.product.toString() === productId);
    let status = -1
    if (productIndex !== -1) {
      status = 200
      user.cartItems[productIndex].qty = qty;  // update existing product qty
    } else {
      status = 201
      user.cartItems.push({ product: productId, qty });  // add new product to cart
    }
  
    try {
      await user.save();  
      return {status, cartItems: user.cartItems};
    } catch (err) {
      console.error(err);
      return {status:500, cartItems: null};
    }
  }
  
