import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from '../features/auth/authApi';
import { resetSchema } from '../features/auth/authSchemas';
import { errorMessage } from '../app/api';
import { FormField, inputClass } from '../components/FormField';
import { Button } from '../components/Button';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [reset, { isLoading }] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetSchema) });

  const onSubmit = async ({ password }) => {
    try {
      const data = await reset({ token: params.get('token'), password }).unwrap();
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h1 className="text-xl font-bold">Set a new password</h1>
      <FormField label="New password" error={errors.password?.message}>
        <input type="password" className={inputClass} {...register('password')} />
      </FormField>
      <FormField label="Confirm password" error={errors.confirmPassword?.message}>
        <input type="password" className={inputClass} {...register('confirmPassword')} />
      </FormField>
      <Button type="submit" loading={isLoading}>
        Update password
      </Button>
    </form>
  );
}
