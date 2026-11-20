import { PlusOutlined } from '@ant-design/icons';
import type { ButtonHTMLAttributes } from 'react';
import styles from './AddExpenseButton.module.css';

type AddExpenseButtonProps = {
  /** Czy przycisk ma być przyklejony do prawego dolnego rogu */
  fixed?: boolean;
  onClick?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export const AddExpenseButton = ({
  fixed = false,
  onClick,
  ...rest
}: AddExpenseButtonProps) => {
  const className = [styles.addExpenseButton, fixed ? styles.fixed : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button className={className} onClick={onClick} {...rest}>
      <span className={styles.icon}>
        <PlusOutlined />
      </span>
      Dodaj wydatek
    </button>
  );
};

export default AddExpenseButton;
