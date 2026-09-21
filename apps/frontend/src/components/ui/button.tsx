import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading = false, icon, iconPosition = 'right', children, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'w-full h-12 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all font-semibold';

    const variantStyles = {
      primary: 'bg-brand-blue hover:bg-brand-blue-hover text-white',
      secondary: 'bg-surface-container-lowest text-brand-blue font-semibold shadow-sm hover:bg-surface-container transition-colors',
      ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-high',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[20px]">
              progress_activity
            </span>
            <span>Procesando...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
