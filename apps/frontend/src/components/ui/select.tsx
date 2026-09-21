import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly SelectOption[];
  error?: string;
  icon?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-on-surface-variant">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={`w-full h-12 bg-surface-container-lowest text-on-surface rounded-lg px-3.5 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all ${
              error ? 'ring-2 ring-error' : ''
            } ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-3.5 text-outline pointer-events-none text-[20px]">
          </span>
        </div>
        {error && (
          <span className="text-xs text-error">{error}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
