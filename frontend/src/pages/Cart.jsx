import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeItem, selectCartTotal, setQty } from '../store/cartSlice';
import { api } from '../api';
import useForm from '../hooks/useForm';

export default function Cart() {
  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { values, errors, onChange, handleSubmit } = useForm({ address: '' }, (v) =>
    v.address.trim().length < 5 ? { address: 'Enter your full delivery address' } : {}
  );

  const placeOrder = async ({ address }) => {
    if (!user) return navigate('/login', { state: { from: { pathname: '/cart' } } });
    setBusy(true);
    setError('');
    try {
      await api('/orders', {
        method: 'POST',
        body: { address, items: items.map((i) => ({ food: i.id, qty: i.qty })) },
      });
      dispatch(clearCart());
      navigate('/orders');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-5xl" aria-hidden="true">🛒</p>
        <p className="my-2 text-lg">Your cart is empty.</p>
        <Link to="/menu" className="btn">Browse menu</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="space-y-3 lg:col-span-2" aria-label="Cart items">
        <h1 className="text-3xl font-extrabold">Your cart</h1>
        {items.map((i) => (
          <div key={i.id} className="card flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">{i.emoji}</span>
            <div className="flex-1">
              <p className="font-bold">{i.name}</p>
              <p className="text-sm text-gray-500">₹{i.price} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-outline px-3" aria-label={`Decrease ${i.name}`} onClick={() => dispatch(setQty({ id: i.id, qty: i.qty - 1 }))}>−</button>
              <span className="w-6 text-center" aria-live="polite">{i.qty}</span>
              <button className="btn-outline px-3" aria-label={`Increase ${i.name}`} onClick={() => dispatch(setQty({ id: i.id, qty: i.qty + 1 }))}>+</button>
            </div>
            <p className="w-16 text-right font-bold">₹{i.price * i.qty}</p>
            <button onClick={() => dispatch(removeItem(i.id))} aria-label={`Remove ${i.name}`} className="text-red-600">✕</button>
          </div>
        ))}
      </section>

      <form onSubmit={handleSubmit(placeOrder)} className="card h-fit space-y-4" noValidate>
        <h2 className="text-xl font-bold">Checkout</h2>
        <div>
          <label htmlFor="address" className="mb-1 block font-medium">Delivery address</label>
          <textarea id="address" name="address" rows="3" className="input" value={values.address} onChange={onChange} aria-invalid={!!errors.address} />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>
        <p className="flex justify-between text-lg font-extrabold"><span>Total</span><span>₹{total}</span></p>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <button className="btn w-full" disabled={busy}>{busy ? 'Placing…' : user ? 'Place order' : 'Login to order'}</button>
      </form>
    </div>
  );
}
