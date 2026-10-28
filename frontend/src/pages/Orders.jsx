import { useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import { getSocket } from '../socket';
import { useSelector } from 'react-redux';

export const STATUS_STYLE = {
  placed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-yellow-100 text-yellow-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Orders() {
  const { data: orders, loading, error, refetch } = useFetch('/orders/mine');
  const token = useSelector((s) => s.auth.token);

  // Refresh automatically when the server pushes a status change
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.on('order:update', refetch);
    return () => socket.off('order:update', refetch);
  }, [token, refetch]);

  return (
    <>
      <h1 className="mb-4 text-3xl font-extrabold">My orders</h1>
      {loading && <p>Loading…</p>}
      {error && <p role="alert" className="text-red-600">{error}</p>}
      {orders?.length === 0 && <p>No orders yet.</p>}
      <div className="space-y-3">
        {orders?.map((o) => (
          <article key={o._id} className="card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-gray-500">#{o._id.slice(-6)} · {new Date(o.createdAt).toLocaleString()}</p>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLE[o.status]}`}>{o.status.replaceAll('_', ' ')}</span>
            </div>
            <ul className="my-2 list-inside list-disc">
              {o.items.map((i) => (
                <li key={i.food}>{i.qty} × {i.name}</li>
              ))}
            </ul>
            <p className="font-bold">Total ₹{o.total}</p>
            <p className="text-sm text-gray-500">Deliver to: {o.address}</p>
          </article>
        ))}
      </div>
    </>
  );
}
