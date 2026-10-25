import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { loginSchema } from '../features/auth/authSchemas';
import { errorMessage } from '../app/api';
import { FormField, inputClass } from '../components/FormField';
import { Button } from '../components/Button';

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    try {
      const data = await login(values).unwrap();
      dispatch(setCredentials(data));
      toast.success(`Welcome back, ${data.user.name}`);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h1 className="text-xl font-bold">Log in</h1>
      <FormField label="Email" error={errors.email?.message}>
        <input type="email" autoComplete="email" className={inputClass} {...register('email')} />
      </FormField>
      <FormField label="Password" error={errors.password?.message}>
        <input type="password" autoComplete="current-password" className={inputClass} {...register('password')} />
      </FormField>
      <div className="text-right text-sm">
        <Link to="/forgot-password" className="text-brand-600 hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" loading={isLoading}>
        Log in
      </Button>
      <p className="text-center text-sm text-slate-600">
        New here?{' '}
        <Link to="/register" className="font-medium text-brand-600 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
