import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice';
import useForm from '../hooks/useForm';

const validate = (v) => {
  const e = {};
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Enter a valid email';
  if (!v.password) e.password = 'Password is required';
  return e;
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, status, error } = useSelector((s) => s.auth);
  const { values, errors, onChange, handleSubmit } = useForm({ email: '', password: '' }, validate);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate(location.state?.from?.pathname || '/menu', { replace: true });
  }, [user, navigate, location]);

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit((v) => dispatch(login(v)))} className="card space-y-4" noValidate>
        <h1 className="text-2xl font-extrabold">Welcome back</h1>
        {error && <p role="alert" className="rounded-lg bg-red-100 p-3 text-red-700">{error}</p>}

        <div>
          <label htmlFor="email" className="mb-1 block font-medium">Email</label>
          <input id="email" name="email" type="email" className="input" value={values.email} onChange={onChange} autoComplete="email" aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block font-medium">Password</label>
          <input id="password" name="password" type="password" className="input" value={values.password} onChange={onChange} autoComplete="current-password" aria-invalid={!!errors.password} />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <button className="btn w-full" disabled={status === 'loading'}>{status === 'loading' ? 'Signing in…' : 'Login'}</button>
        <p className="text-center text-sm">
          New here? <Link to="/register" className="font-semibold text-brand-600">Create an account</Link>
        </p>
        <p className="rounded-lg bg-gray-100 p-2 text-center text-xs dark:bg-gray-700">Demo admin: admin@quickbite.com / Admin@123</p>
      </form>
    </div>
  );
}
