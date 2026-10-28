import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import useForm from '../hooks/useForm';
import { api } from '../api';
import { getSocket } from '../socket';
import { STATUS_STYLE } from './Orders';

const STATUSES = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

function OrdersTab() {
  const { data: orders, loading, error, refetch } = useFetch('/orders');

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.on('order:new', refetch);
    return () => socket.off('order:new', refetch);
  }, [refetch]);

  const update = async (id, status) => {
    await api(`/orders/${id}/status`, { method: 'PATCH', body: { status } });
    refetch();
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p role="alert" className="text-red-600">{error}</p>;
  if (!orders?.length) return <p>No orders yet.</p>;

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <article key={o._id} className="card flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold">#{o._id.slice(-6)} · {o.user?.name}</p>
            <p className="text-sm text-gray-500">{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</p>
            <p className="text-sm">₹{o.total} · {o.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLE[o.status]}`}>{o.status.replaceAll('_', ' ')}</span>
            <label className="sr-only" htmlFor={`st-${o._id}`}>Update status</label>
            <select id={`st-${o._id}`} className="input w-auto" value={o.status} onChange={(e) => update(o._id, e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>
              ))}
            </select>
          </div>
        </article>
      ))}
    </div>
  );
}

function FoodsTab() {
  const { data: foods, loading, refetch } = useFetch('/foods');
  const [error, setError] = useState('');
  const { values, errors, onChange, handleSubmit, reset } = useForm(
    { name: '', description: '', price: '', category: 'Main', emoji: '🍽️' },
    (v) => {
      const e = {};
      if (!v.name.trim()) e.name = 'Name is required';
      if (!(Number(v.price) >= 0) || v.price === '') e.price = 'Enter a valid price';
      return e;
    }
  );

  const add = async (v) => {
    try {
      await api('/foods', { method: 'POST', body: { ...v, price: Number(v.price) } });
      reset();
      setError('');
      refetch();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    await api(`/foods/${id}`, { method: 'DELETE' });
    refetch();
  };

  const toggle = async (f) => {
    await api(`/foods/${f._id}`, { method: 'PUT', body: { available: !f.available } });
    refetch();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={handleSubmit(add)} className="card h-fit space-y-3" noValidate>
        <h2 className="text-lg font-bold">Add food</h2>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        {[
          ['name', 'Name'],
          ['description', 'Description'],
          ['price', 'Price (₹)'],
          ['category', 'Category'],
          ['emoji', 'Emoji'],
        ].map(([n, l]) => (
          <div key={n}>
            <label htmlFor={`f-${n}`} className="mb-1 block text-sm font-medium">{l}</label>
            <input id={`f-${n}`} name={n} className="input" value={values[n]} onChange={onChange} />
            {errors[n] && <p className="text-sm text-red-600">{errors[n]}</p>}
          </div>
        ))}
        <button className="btn w-full">Add item</button>
      </form>

      <div className="space-y-2 lg:col-span-2">
        {loading && <p>Loading…</p>}
        {foods?.map((f) => (
          <div key={f._id} className="card flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">{f.emoji}</span>
            <div className="flex-1">
              <p className="font-bold">{f.name} <span className="font-normal text-gray-500">· ₹{f.price}</span></p>
              <p className="text-sm text-gray-500">{f.category}{!f.available && ' · hidden'}</p>
            </div>
            <button className="btn-outline" onClick={() => toggle(f)}>{f.available ? 'Hide' : 'Show'}</button>
            <button className="text-red-600" onClick={() => remove(f._id)} aria-label={`Delete ${f.name}`}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('orders');
  return (
    <>
      <h1 className="mb-4 text-3xl font-extrabold">Admin dashboard</h1>
      <div className="mb-6 flex gap-2" role="tablist">
        {['orders', 'foods'].map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 font-semibold capitalize ${tab === t ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'orders' ? <OrdersTab /> : <FoodsTab />}
    </>
  );
}
