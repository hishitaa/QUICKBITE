import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/authSlice';
import useForm from '../hooks/useForm';

const validate = (v) => {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Enter a valid email';
  if (v.password.length < 6) e.password = 'Password must be at least 6 characters';
  if (v.password !== v.confirm) e.confirm = 'Passwords do not match';
  return e;
};

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((s) => s.auth);
  const { values, errors, onChange, handleSubmit } = useForm(
    { name: '', email: '', password: '', confirm: '' },
    validate
  );

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate('/menu', { replace: true });
  }, [user, navigate]);

  const field = (name, label, type = 'text', auto) => (
    <div>
      <label htmlFor={name} className="mb-1 block font-medium">{label}</label>
      <input id={name} name={name} type={type} className="input" value={values[name]} onChange={onChange} autoComplete={auto} aria-invalid={!!errors[name]} />
      {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-md">
      <form
        onSubmit={handleSubmit(({ name, email, password }) => dispatch(register({ name, email, password })))}
        className="card space-y-4"
        noValidate
      >
        <h1 className="text-2xl font-extrabold">Create your account</h1>
        {error && <p role="alert" className="rounded-lg bg-red-100 p-3 text-red-700">{error}</p>}
        {field('name', 'Full name', 'text', 'name')}
        {field('email', 'Email', 'email', 'email')}
        {field('password', 'Password', 'password', 'new-password')}
        {field('confirm', 'Confirm password', 'password', 'new-password')}
        <button className="btn w-full" disabled={status === 'loading'}>{status === 'loading' ? 'Creating…' : 'Register'}</button>
        <p className="text-center text-sm">
          Already have an account? <Link to="/login" className="font-semibold text-brand-600">Login</Link>
        </p>
      </form>
    </div>
  );
}
