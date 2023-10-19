import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getOrders, getOrdersByUserId, OrdersResponse } from '@/lib/handlers';
import { createOrder, CreateOrderResponse } from '@/lib/handlers';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
): Promise<NextResponse<OrdersResponse> | {}> {
  const session: Session | null = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({error: "Invalid userId"}, { status: 400 });
  }
  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }
  

  const orders = await getOrdersByUserId(params.userId);
  
  if (orders === null) {
    return NextResponse.json({error: "User not found / User doesn't have any order"}, { status: 404 });
  }
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  return NextResponse.json(orders);
}


export async function POST(
    request: NextRequest,
    {
        params,
      }: {
        params: { userId: string };
      }
  ): Promise<NextResponse<CreateOrderResponse> | {} > {
    const body = await request.json();
    const session: Session | null = await getServerSession(authOptions);
  
    if (!session?.user) {
      return NextResponse.json({}, { status: 401 });
    }

    if (session.user._id !== params.userId) {
      return NextResponse.json({}, { status: 403 });
    }
  
    if (!Types.ObjectId.isValid(params.userId) || !body.address || !body.cardHolder || !body.cardNumber ) {
      return NextResponse.json({error: "Invalid userId, or any attribute error"}, { status: 400 });
    }
      
    const orders = await createOrder(params.userId, body);
    if (orders === 0){
      return NextResponse.json({error: "The cart is empty"}, { status: 400 });
    }
    if (!orders) {
        return NextResponse.json({error: "User not found"}, { status: 404 });
    }

    if ('_id' in orders && orders._id) {
        return NextResponse.json(orders, { 
            status: 201, 
            headers: {
                'Location': `/api/users/${params.userId}/orders/${orders._id}`
            }
        });
    }
    
    return NextResponse.json(orders, { status: 201});
  }