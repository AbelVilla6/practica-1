import { ProductsResponse, getOrders } from '@/lib/handlers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse<ProductsResponse>> {
  const products = await getOrders();

  return NextResponse.json(products);
}