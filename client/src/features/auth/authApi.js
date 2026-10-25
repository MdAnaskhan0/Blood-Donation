import { api } from '../../app/api';

const post = (url) => (body) => ({ url, method: 'POST', body });

export const authApi = api.injectEndpoints({
  endpoints: (b) => ({
    register: b.mutation({ query: post('/auth/register') }),
    login: b.mutation({ query: post('/auth/login') }),
    verifyEmail: b.mutation({ query: post('/auth/verify-email') }),
    resendVerification: b.mutation({ query: post('/auth/resend-verification') }),
    forgotPassword: b.mutation({ query: post('/auth/forgot-password') }),
    resetPassword: b.mutation({ query: post('/auth/reset-password') }),
    getMe: b.query({ query: () => '/auth/me', providesTags: ['Me'] }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
} = authApi;
