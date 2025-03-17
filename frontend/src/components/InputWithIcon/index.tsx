import { memo } from 'react';
import { InputWithIconProps } from './type';

function InputWithIcon({
  icon = <i className="fa-regular fa-envelope"></i>,
  type = 'email',
  placeholder = 'Email',
  value = '',
  name,
  onChange,
}: InputWithIconProps) {
  return (
    <div className="border-[1px] border-solid border-[var(--gray)] rounded-[4px] flex items-center text-inherit">
      <div className="w-12 text-center text-[1.6rem] text-[var(--gray)]">
        {icon}
      </div>

      <div className="grow border-l-[1px] border-solid border-[var(--gray)]">
        <input
          className="block w-full px-4 py-3 focus:outline-[var(--primary)] bg-inherit"
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default memo(InputWithIcon);
