import { FiLoader } from 'react-icons/fi';

export function Button({ loading, children, className = '', ...props }) {
  return (
    <button
      disabled={loading || props.disabled}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading && <FiLoader className="animate-spin" />}
      {children}
    </button>
  );
}
