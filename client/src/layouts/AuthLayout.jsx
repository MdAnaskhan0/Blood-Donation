import { Link, Outlet } from 'react-router-dom';
import { MdBloodtype } from 'react-icons/md';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 text-brand-600">
          <MdBloodtype className="text-4xl" />
          <span className="text-xl font-bold">Blood Donation System</span>
        </Link>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
