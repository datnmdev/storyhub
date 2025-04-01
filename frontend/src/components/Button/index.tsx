import colors from '@assets/colors';
import { ButtonProps } from './Button.type';

function Button({
  width,
  minWidth,
  height = 38,
  color = colors.white,
  bgColor = colors.primary,
  borderRadius = '4px',
  padding = '0',
  children,
  disabled = false,
  sx,
  onClick,
}: ButtonProps) {
  return (
    <div
      className="flex justify-center items-center hover:opacity-60 cursor-pointer select-none"
      style={{
        width:
          width !== undefined
            ? width
            : minWidth !== undefined
              ? undefined
              : 120,
        minWidth,
        height,
        color,
        backgroundColor: disabled ? 'var(--gray)' : bgColor,
        borderRadius,
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding,
        ...sx,
      }}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
    >
      {children}
    </div>
  );
}

export default Button;
