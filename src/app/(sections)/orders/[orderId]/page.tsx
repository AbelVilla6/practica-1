import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { getUser, getUserOrderById, OrderIdResponse } from '@/lib/handlers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Order_details({
  params,
}: {
  params: { orderId: string };
}) {
  const session: Session | null = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/api/auth/signin');
  }

  const user = await getUser(session.user._id);

  if (user === null) {
    notFound();
  }

  const order: OrderIdResponse | null = await getUserOrderById(
    session.user._id, params.orderId
  );

  if (!order || order.orderItems === null) {
    notFound();
  }

  const date = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
});
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Order Details</h3>
            <div className='relative overflow-x-auto'>
                
                <span className="flex flex-none items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 flex-none h-6">
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                    </svg>
                    <span className="font-bold ml-2 flex-none text-gray-800">Order ID:</span>
                    <span className="ml-2 text-black">{order._id}</span>
                </span>
                <span className="mt-4 flex items-center flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 flex-none h-5">
                      <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                      <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                    </svg>      
                    <span className="font-bold flex-none ml-2 text-gray-800">Shipping Address:</span>
                    <span className="ml-2 text-black">{order.address}</span>
                </span>
                <span className="mt-4 flex flex-none items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 flex-none h-6">
                  <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                  <path fill-rule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clip-rule="evenodd" />
                </svg>


                    <span className="font-bold flex-none ml-2 text-gray-800">Payment Information:</span>
                    <span className="ml-2 flex-none text-black">{order.cardNumber} ({order.cardHolder})</span>
                </span>
                <span className="mt-4 mb-4 flex-none flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 flex-none h-6">
                  <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" />
                </svg>
                    <span className="font-bold ml-2 flex-none text-gray-800">Order Date:</span>
                    <span className="ml-2 flex-none text-black">{date}</span>
                </span>
            </div>
            <div className="relative overflow-x-auto shadow-lg bg-white rounded-lg shadow-md p-6 mb-4">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th scope="col" className="text-left font-semibold">PRODUCT</th>
                            <th scope="col" className="text-center font-semibold px-4">QUANTITY</th>
                            <th scope="col" className="text-right font-semibold px-4">PRICE</th>
                            <th scope="col" className="text-right font-semibold px-4">TOTAL</th>
                        </tr>
                        <tr>
                            <td colSpan={4}><hr className="my-2" /></td>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems.map((orderItem: any) => (
                            <tr key={orderItem.product._id.toString()}>
                                <th scope="row" className='py-4 text-left'>
                                    <Link href={`/products/${orderItem.product._id}`}>
                                        <span className="font-semibold">{orderItem.product.name}</span>
                                    </Link>
                                </th>
                                <td scope="row" className='py-4 text-center'>{orderItem.qty}</td>
                                <td scope="row" className='py-4 text-right'>{orderItem.price} €</td>                                
                                <td scope="row" className='py-4 text-right'>{(orderItem.price * orderItem.qty).toFixed(2)} €</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr className="my-4"></hr>
                <div className="flex justify-between items-center">
                    <span className="font-bold">Total:</span>
                    <span className="font-semibold">
                        {
                            order.orderItems
                                .map((orderItem: any) => Math.round(orderItem.price * orderItem.qty * 100) / 100)
                                .reduce((accumulator: any, total: number) => accumulator + total, 0)
                                .toFixed(2)
                        }
                        €
                    </span>
                </div>
            </div>
        </div>
    )
}