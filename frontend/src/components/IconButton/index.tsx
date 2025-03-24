import { IconButtonProps } from './IconButton.type';

function IconButton({
  icon,
  children,
  color,
  bgColor,
  fontSize,
  width,
  height,
  border,
  borderRadius,
  boxShadow,
  padding,
  disable = false,
  sx,
  onClick,
}: IconButtonProps) {
  return (
    <div
      className="flex justify-center items-center space-x-1 hover:opacity-60"
      style={{
        width,
        height,
        fontSize,
        color,
        backgroundColor: disable ? 'var(--gray)' : bgColor,
        border,
        borderRadius,
        boxShadow,
        padding,
        cursor: disable ? 'not-allowed' : 'pointer',
        ...sx,
      }}
      onClick={disable ? (e) => e.preventDefault() : onClick}
    >
      <span>{icon}</span>
      {children && <span>{children}</span>}
    </div>
  );
}

export default IconButton;
