import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

// One shared API slice. Each feature injects its own endpoints (injectEndpoints).
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Me'],
  endpoints: () => ({}),
});

// Turn an RTK Query error into a readable string.
export const errorMessage = (err) => err?.data?.message || err?.error || 'Something went wrong';
