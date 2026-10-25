import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../features/auth/authApi';
import { registerSchema, ROLES, BLOOD_GROUPS } from '../features/auth/authSchemas';
import { errorMessage } from '../app/api';
import { FormField, inputClass } from '../components/FormField';
import { Button } from '../components/Button';

export default function Register() {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { role: 'donor' } });

  const role = watch('role');

  const onSubmit = async ({ confirmPassword, ...values }) => {
    try {
      if (values.role !== 'donor') {
        delete values.bloodGroup;
        delete values.city;
      }
      const data = await registerUser(values).unwrap();
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h1 className="text-xl font-bold">Create your account</h1>

      <FormField label="I am a" error={errors.role?.message}>
        <select className={inputClass} {...register('role')}>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label={role === 'hospital' || role === 'blood_bank' ? 'Organization name' : 'Full name'} error={errors.name?.message}>
        <input className={inputClass} {...register('name')} />
      </FormField>

      <FormField label="Email" error={errors.email?.message}>
        <input type="email" autoComplete="email" className={inputClass} {...register('email')} />
      </FormField>

      <FormField label="Phone (optional)" error={errors.phone?.message}>
        <input type="tel" className={inputClass} {...register('phone')} />
      </FormField>

      {role === 'donor' && (
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Blood group" error={errors.bloodGroup?.message}>
            <select className={inputClass} {...register('bloodGroup')}>
              <option value="">Select</option>
              {BLOOD_GROUPS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </FormField>
          <FormField label="City" error={errors.city?.message}>
            <input className={inputClass} {...register('city')} />
          </FormField>
        </div>
      )}

      <FormField label="Password" error={errors.password?.message}>
        <input type="password" autoComplete="new-password" className={inputClass} {...register('password')} />
      </FormField>
      <FormField label="Confirm password" error={errors.confirmPassword?.message}>
        <input type="password" autoComplete="new-password" className={inputClass} {...register('confirmPassword')} />
      </FormField>

      <Button type="submit" loading={isLoading}>
        Register
      </Button>
      <p className="text-center text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
