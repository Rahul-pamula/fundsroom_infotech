import type { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export function Button({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

