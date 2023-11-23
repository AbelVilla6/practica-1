import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/handlers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { Session } from 'next-auth';
import CartItemCounter from "@/components/CartItemCounter";

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

  const session: Session | null = await getServerSession(authOptions);

  const product = await getProduct(params.productId);

  if (product === null) {
    notFound();
  }

  return (
    <div className='flex flex-col lg:flex-row items-start lg:items-start'>

      <div className='lg:w-1/2 lg:mr-8'>
        <h3 className='text-3xl font-bold mb-4'>{product.name}</h3>

        {product.img && (
          <div className='flex flex-col items-center'>
            <img
              src={product.img}
              alt={product.name}
              className='w-52 h-auto mb-4'
            />

            <p className='text-2xl font-bold mb-2'>
              {product.price} €
            </p>
            {session && (
              <CartItemCounter productId={params.productId} />
            )}
          </div>
        )}
      </div>

      
      <div className='lg:w-2/3 mt-4 lg:mt-14'>
        <h4 className='text-xl font-bold mb-2'>Product Description</h4>
        <p>{product.description}</p>
      </div>
      

      </div>
  );
}