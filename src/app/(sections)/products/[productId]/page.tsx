import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/handlers';
import { TrashIcon } from '@heroicons/react/24/outline';

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

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

            <div className='flex items-center'>
              <button className="text-gray-500 bg-gray-300 px-2 py-1 rounded-md mr-1">-</button>
              <span className="bg-gray-200 px-2 py-1 rounded-md">
                0
              </span>
              <button className="text-gray-500 bg-gray-300 px-2 py-1 rounded-md ml-1">+</button>
              <button className="text-gray-500 bg-red-200 px-2 py-1 rounded-md ml-1">
                <TrashIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            </div>
          </div>
        )}
      </div>

      
      <div className='lg:w-auto mt-4 lg:mt-0'>
        <h4 className='text-xl font-bold mb-2'>Product Description</h4>
        <p>{product.description}</p>
      </div>
      

      </div>
  );
}