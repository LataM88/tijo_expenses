type ButtonProps = {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export const Button = ({
  text,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};
