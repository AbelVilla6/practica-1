import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getCartByUserId, CartResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
): Promise<NextResponse<CartResponse> | {}> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const cartItems = await getCartByUserId(params.userId);
  
  if (cartItems === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(cartItems);
}