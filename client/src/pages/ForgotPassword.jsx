import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForgotPasswordMutation } from '../features/auth/authApi';
import { forgotSchema } from '../features/auth/authSchemas';
import { errorMessage } from '../app/api';
import { FormField, inputClass } from '../components/FormField';
import { Button } from '../components/Button';

export default function ForgotPassword() {
  const [forgot, { isLoading }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (values) => {
    try {
      const data = await forgot(values).unwrap();
      toast.success(data.message);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h1 className="text-xl font-bold">Forgot password</h1>
      <FormField label="Email" error={errors.email?.message}>
        <input type="email" className={inputClass} {...register('email')} />
      </FormField>
      <Button type="submit" loading={isLoading}>
        Send reset link
      </Button>
      <p className="text-center text-sm">
        <Link to="/login" className="text-brand-600 hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}
