import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getOrders, getOrdersByUserId, OrdersResponse } from '@/lib/handlers';
import { createOrder, CreateOrderResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
): Promise<NextResponse<OrdersResponse> | {}> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const orders = await getOrdersByUserId(params.userId);
  
  if (orders === null) {
    return NextResponse.json({error: "User not found"}, { status: 404 });
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
  
    if (!Types.ObjectId.isValid(params.userId) || !body.address || !body.cardHolder || !body.cardNumber ) {
      return NextResponse.json({}, { status: 400 });
    }
      
    const orders = await createOrder(params.userId, body);
    if (!orders) {
        return NextResponse.json({error: "User not found"}, { status: 404 });
    }
    if (Object.keys(orders).length === 0){
        return NextResponse.json({}, { status: 400 });
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