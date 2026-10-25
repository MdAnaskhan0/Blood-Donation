import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';

const NEXT = {
  donor: 'Update availability, check eligibility, see nearby requests (Phase 2).',
  recipient: 'Create blood requests and track their status (Phase 2).',
  hospital: 'Verify donors and manage requests (Phase 5).',
  blood_bank: 'Manage inventory and expiry (Phase 5).',
  volunteer: 'Assist emergency requests and campaigns (Phase 6).',
  admin: 'Verify requests, hospitals and blood banks; view analytics (Phase 7).',
};

export default function Dashboard() {
  const user = useSelector(selectUser);
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-bold">Hello, {user?.name}</h1>
      <p className="mt-1 text-slate-600">
        You are logged in as <span className="font-medium capitalize">{user?.role?.replace('_', ' ')}</span>.
      </p>
      <p className="mt-4 rounded-lg bg-brand-50 p-4 text-sm text-brand-700">Coming next: {NEXT[user?.role]}</p>
    </div>
  );
}
