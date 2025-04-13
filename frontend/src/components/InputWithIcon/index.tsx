import { memo } from 'react';
import { InputWithIconProps } from './InputWithIcon.type';
import { useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';

function InputWithIcon({
  icon = <i className="fa-regular fa-envelope"></i>,
  type = 'email',
  placeholder = 'Email',
  value = '',
  name,
  max,
  maxLength,
  minLength,
  onFocus,
  onBlur,
  contentEditable = true,
  onChange = () => {},
}: InputWithIconProps) {
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);

  return (
    <div className="border-[1px] border-solid border-[var(--gray)] rounded-[4px] flex items-center text-inherit">
      <div className="w-12 text-center text-[1.6rem] text-[var(--gray)]">
        {icon}
      </div>

      <div className="grow border-l-[1px] border-solid border-[var(--gray)]">
        <input
          className="block w-full px-4 py-3 focus:outline-[var(--primary)] bg-inherit"
          style={{
            colorScheme: themeValue === 'light' ? 'light' : 'dark',
          }}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          max={max}
          maxLength={maxLength}
          minLength={minLength}
          contentEditable={contentEditable}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}

export default memo(InputWithIcon);
