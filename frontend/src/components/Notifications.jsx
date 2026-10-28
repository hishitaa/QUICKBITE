import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { connectSocket, disconnectSocket } from '../socket';

const LABELS = {
  placed: 'Order placed',
  preparing: 'is being prepared',
  out_for_delivery: 'is out for delivery',
  delivered: 'has been delivered',
  cancelled: 'was cancelled',
};

// Real-time toast notifications driven by Socket.io
export default function Notifications() {
  const { token, user } = useSelector((s) => s.auth);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }
    const socket = connectSocket(token);
    const push = (text) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, text }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
    };
    socket.on('order:update', (o) => push(`🔔 Your order ${LABELS[o.status] || o.status}`));
    socket.on('order:new', (o) => push(`🆕 New order of ₹${o.total} from ${o.by}`));
    return () => disconnectSocket();
  }, [token, user?.role]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="rounded-lg bg-gray-900 px-4 py-3 text-white shadow-lg dark:bg-white dark:text-gray-900">
          {t.text}
        </div>
      ))}
    </div>
  );
}
