import { memo } from 'react';
import { SelectWithIconProps } from './SelectWithIcon.type';
import Select from '@components/Select';

function SelectWithIcon({
  icon,
  name,
  value,
  border,
  onChange,
  children,
}: SelectWithIconProps) {
  return (
    <div className="border-[1px] border-solid border-[var(--gray)] rounded-[4px] flex items-center text-inherit">
      <div className="w-12 text-center text-[1.6rem] text-[var(--gray)] shrink-0">
        {icon}
      </div>

      <div className="grow border-l-[1px] border-solid border-[var(--gray)] line-clamp-1">
        <Select name={name} border={border} value={value} onChange={onChange}>
          {children}
        </Select>
      </div>
    </div>
  );
}

export default memo(SelectWithIcon);
