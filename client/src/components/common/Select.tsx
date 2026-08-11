import { forwardRef, type SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>((props, ref) => {
  return (
    <select
      ref={ref}
      {...props}
      className={clsx(
        'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
        props.className
      )}
    >
      {props.children}
    </select>
  );
});
