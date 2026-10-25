import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { useVerifyEmailMutation } from '../features/auth/authApi';
import { errorMessage } from '../app/api';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [verify, { isLoading, isSuccess, isError, error }] = useVerifyEmailMutation();
  const called = useRef(false); // StrictMode runs effects twice in dev; the token is single-use.

  useEffect(() => {
    if (token && !called.current) {
      called.current = true;
      verify({ token });
    }
  }, [token, verify]);

  return (
    <div className="space-y-4 text-center">
      {(!token || isError) && (
        <>
          <FiXCircle className="mx-auto text-5xl text-red-500" />
          <p className="font-medium">{token ? errorMessage(error) : 'Missing verification token.'}</p>
        </>
      )}
      {token && (isLoading || (!isSuccess && !isError)) && (
        <>
          <FiLoader className="mx-auto animate-spin text-5xl text-slate-400" />
          <p>Verifying your email...</p>
        </>
      )}
      {isSuccess && (
        <>
          <FiCheckCircle className="mx-auto text-5xl text-green-600" />
          <p className="font-medium">Email verified. You can now log in.</p>
        </>
      )}
      <Link to="/login" className="inline-block text-sm font-medium text-brand-600 hover:underline">
        Go to login
      </Link>
    </div>
  );
}
