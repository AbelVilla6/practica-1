import Products, { Product } from '@/models/Product';
import Orders, { Order } from '@/models/Order';
import connect from '@/lib/mongoose';
import Users, { User } from '@/models/User';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

//GET /api/products
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

//GET /api/orders
export interface OrdersResponse {
  orders : Order[];
}

/*
export interface OrdersResponse {
  orders: {
    _id: number,
    date: number,
    address: string,
    cardHolder: string,
    orderItems: {
      product: {
        _id:number,
        name:string,
        description: string,
        price: number,
        }
        qty : number,
        price : number,
      }
  }[] | null,} */

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

//POST /api/users
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
    const hash = await bcrypt.hash(user.password, 10);
    const doc: User = {
      ...user,
      password: hash,
      birthdate: new Date(user.birthdate),
      cartItems: [],
      orders: [],
    };
  
    const newUser = await Users.create(doc);
  
    return {
      _id: newUser._id,
    };
  }

//GET /api/users/{userId}
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

//GET /api/products/{productId}
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
//GET /api/users/{userId}/cart
  export interface CartResponse {
    cartItems: {
      product: {
        _id:Types.ObjectId,
        name:string,
        description: string,
        price: number,
      }
      qty : number,
    }[] | null, 
    
  }
  /*interface CartItem {
    product:string,
    qty:number,
  }*/
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
    
    const cartItems = await Users.findById(userId, cartProjection).populate("cartItems.product", productProjection );
    if (!cartItems || !cartItems.cartItems) {
      return null;
    }
    return  cartItems;
  }

  //PUT /api/users/{userId}/cart/{productId}
  export interface ModifyCartResponse{
    status: number,
    cartItems: CartResponse | null,
  }

  export async function modifyCart(
    userId: string, 
    productId: string, 
    qty: number): Promise<ModifyCartResponse> {
    await connect();

    const user = await Users.findById(userId)
    if (!user) return {status:404, cartItems: null};
    const product = await Products.findById(productId)
    if (!product) return {status:404, cartItems: null};
  
    const productIndex = user.cartItems.findIndex((item: any) => item.product.toString() === productId);
    let status = -1
    if (productIndex !== -1) {
      status = 200
      user.cartItems[productIndex].qty = qty;  // update existing product qty
    } else {
      status = 201
      user.cartItems.push({ product: productId, qty });  // add new product to cart
    }
    await user.populate("cartItems.product", {name:true, price:true});
  
    try {
      await user.save();  
      return {status, cartItems: user.cartItems};
    } catch (err) {
      console.error(err);
      return {status:500, cartItems: null};
    }
  }

  //DELETE /api/users/{userId}/cart/{productId}
  export interface DeleteCartResponse{
    cartItems: CartResponse,
  }

  export async function deleteCartItem(
    userId: string, 
    productId: string): Promise<DeleteCartResponse | null> {
    await connect();

    const user = await Users.findById(userId)
    if (!user) return null;
    const product = await Products.findById(productId)
    if (product === null) return null;
  
    const productIndex = user.cartItems.findIndex((item: any) => item.product.toString() === productId);
    
    if (productIndex !== -1) {
      user.cartItems.splice(productIndex,1);
    
    await user.save();      
    }
    await user.populate("cartItems.product", {name:true, price:true});
    return user.cartItems;
}

//GET /api/users/{userId}/orders

export async function getOrdersByUserId(userId: string): Promise<OrdersResponse | null> {
  await connect();
  const ordersProjection = {
    _id: false,
    orders: true, 
  };
  const orderProjection = {
    _id: true,
    address: true,
    date: true,    
    cardHolder: true,
    cardNumber: true, 
  };
  
  const user = await Users.findById(userId, ordersProjection);
  if (!user || !user.orders || user.orders.length === 0) {
    return null;
  }
  
  return user.populate('orders', orderProjection);
}

//POST /api/users/{userId}/orders
export interface CreateOrderResponse {
  _id: Types.ObjectId | string;
}

export async function createOrder(
  userId: string,
  order: {  
    address: string;
    cardHolder: string;
    cardNumber: string;
}): Promise<CreateOrderResponse | null | 0> {
  await connect();

  const user = await Users.findById(userId);
  if (user === null ){
    return null
  }
  if (user.cartItems.length === 0){
    return 0
  }
  await user.populate("cartItems.product", {_id: true, name: true, price: true});
  await user.save();

  const cartItems = user.cartItems.map((item:any) => {
    const orderItems = {
      product: item.product,
      qty: item.qty,
      price: item.product.price,
      };
    return orderItems;
  });
  const doc: Order = {
    ...order,
    date: new Date(),
    orderItems : cartItems,
  };

  const newOrder = await Orders.create(doc);
  user.orders.push(newOrder._id);  

  await user.save();  

  return {
    _id: newOrder._id,
  };
}

//GET /api/users/{userId}/orders/{orderId}
export interface UserOrderResponse {
  cartItems: [] | null;
}
export async function getUserOrderById(userId: string, orderId: string): Promise<OrdersResponse | null> {
  await connect();

  const ordersProjection = {
    _id: false,
    orders: true,
  };
  
  const productProjection = {
    name: true
  }  
  const user = await Users.findById(userId, ordersProjection);
  if (!user || !user.orders || user.orders.length === 0) {
    return null;
  }
  
  const existingOrder = user.orders.findIndex((item:any) => item.toString() === orderId);
  if ( existingOrder === -1){
    return null
  }
  const order = await Orders.findById(orderId, {__v:false});
  return order.populate('orderItems.product', productProjection)
}
