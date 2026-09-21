import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  prefix?: string;
  rightIcon?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, rightIcon, helperText, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-on-surface-variant">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3.5 top-3.5 text-on-surface-variant tabular-nums">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full h-12 bg-surface-container-lowest text-on-surface rounded-lg px-3.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container tabular-nums transition-all ${
              prefix ? 'pl-9' : ''
            } ${error ? 'ring-2 ring-error' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className={`absolute right-3 top-3.5 text-[20px] ${
              error ? 'text-error' : 'text-brand-blue'
            }`}>
              {error ? 'error' : rightIcon}
            </span>
          )}
        </div>
        {error && (
          <span className="text-xs text-error">{error}</span>
        )}
        {helperText && !error && (
          <span className="text-xs text-on-surface-variant">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
