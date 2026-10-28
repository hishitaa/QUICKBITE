import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { selectCartCount } from '../store/cartSlice';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const count = useSelector(selectCartCount);
  const { dark, toggle } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 font-medium hover:text-brand-600 ${isActive ? 'text-brand-600' : ''}`;

  const doLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Main">
        <Link to="/" className="text-xl font-extrabold text-brand-600">
          🍔 QuickBite
        </Link>

        <button
          className="rounded-md p-2 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        <div className={`${open ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col gap-1 border-b bg-white p-4 dark:bg-gray-900 md:static md:flex md:w-auto md:flex-row md:items-center md:border-0 md:p-0`}>
          <NavLink to="/menu" className={linkClass} onClick={() => setOpen(false)}>Menu</NavLink>
          {user && <NavLink to="/orders" className={linkClass} onClick={() => setOpen(false)}>My Orders</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>Admin</NavLink>}
          <NavLink to="/cart" className={linkClass} onClick={() => setOpen(false)}>
            Cart <span className="ml-1 rounded-full bg-brand-600 px-2 py-0.5 text-xs text-white">{count}</span>
          </NavLink>
          <button onClick={toggle} className="rounded-md px-3 py-2" aria-label="Toggle dark mode">
            {dark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <button onClick={doLogout} className="btn-outline">Logout ({user.name.split(' ')[0]})</button>
          ) : (
            <Link to="/login" className="btn" onClick={() => setOpen(false)}>Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
