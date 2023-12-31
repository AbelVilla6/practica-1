import { NextRequest, NextResponse } from 'next/server';
import { modifyCart, ModifyCartResponse } from '@/lib/handlers';
import { deleteCartItem, DeleteCartResponse } from '@/lib/handlers';
import { Types } from 'mongoose';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function PUT(
  request: NextRequest, 
  {
    params,
  }: {
    params: {userId: string, productId: string}
  }
): Promise<NextResponse<ModifyCartResponse> | {}> {
  const body = await request.json();
  const session: Session | null = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }

  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }
  
  if (!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
  }

  if (!body.qty || Number(body.qty) <= 0) {
    return NextResponse.json({ error: "Nº items not greater than 0" }, { status: 400 });
  }

  const { status, cartItems } = await modifyCart(params.userId, params.productId, Number(body.qty));

  if (!cartItems) {
    return NextResponse.json({ error: "User or Product not found" }, { status: 404 });
  }

  return NextResponse.json({ cartItems }, { status });
}
export async function DELETE(
  request: NextRequest, 
  {
    params,
  }: {
    params: {userId: string, productId: string}
  }
): Promise<NextResponse<DeleteCartResponse> | {}> {
  const session: Session | null = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  if (session.user._id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }
  
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }
  
  if (!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
  }
  const cartItems = await deleteCartItem(params.userId, params.productId);

  if (cartItems === null ){
    return NextResponse.json({ error: "User or Product not found" }, { status: 404 });
  }

  return NextResponse.json({ cartItems });
}