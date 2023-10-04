import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getUserOrderById, UserOrderResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string, orderId: string };
  }
): Promise<NextResponse<UserOrderResponse> | {}> {
    if (!Types.ObjectId.isValid(params.userId)) {
        return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
      }
      
    if (!Types.ObjectId.isValid(params.orderId)) {
        return NextResponse.json({ error: "Invalid orderId" }, { status: 400 });
    }      

    const order = await getUserOrderById(params.userId, params.orderId);

    if (!order) {
        return NextResponse.json({ error: "User or Order not found" }, { status: 404 });
      }

    return NextResponse.json(order);
}