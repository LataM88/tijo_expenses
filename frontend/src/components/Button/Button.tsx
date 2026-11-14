import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonProps = {
  text?: string;
  children?: ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  text,
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  fullWidth = true,
  className = '',
  ...rest
}: ButtonProps) => {
  const buttonClass = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
      {...rest}
    >
      {text || children}
    </button>
  );
};

export default Button;
