import colors from '@assets/colors';
import { ButtonProps } from './Button.type';

function Button({
  width = 120,
  height = 38,
  color = colors.white,
  bgColor = colors.primary,
  borderRadius = '4px',
  padding = '0',
  children,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <div
      className="flex justify-center items-center hover:opacity-60 cursor-pointer select-none"
      style={{
        width,
        height,
        color,
        backgroundColor: disabled ? 'var(--gray)' : bgColor,
        borderRadius,
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding,
      }}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
    >
      {children}
    </div>
  );
}

export default Button;
