import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdBloodtype } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { logout, selectUser } from '../features/auth/authSlice';

export default function DashboardLayout() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-brand-600">
            <MdBloodtype className="text-3xl" />
            <span className="font-bold">Blood Donation</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-slate-600 sm:inline">
              {user?.name} · <span className="capitalize">{user?.role?.replace('_', ' ')}</span>
            </span>
            <button onClick={onLogout} className="flex items-center gap-1 text-slate-600 hover:text-brand-600">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
