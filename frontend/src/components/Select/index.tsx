import MuiSelect from '@mui/material/Select';
import { memo } from 'react';
import { SelectProps } from './Select.type';
import { useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';

function Select({
  name,
  value,
  border = '1px solid var(--gray)',
  sx = {},
  onChange,
  children,
}: SelectProps) {
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);

  return (
    <MuiSelect
      fullWidth
      inputProps={{
        MenuProps: {
          MenuListProps: {
            sx: {
              backgroundColor:
                themeValue === 'light' ? 'var(--white)' : 'var(--black)',
              color: themeValue === 'light' ? 'var(--black)' : 'var(--white)',
            },
          },
          PaperProps: {
            sx: {
              boxShadow:
                themeValue === 'light'
                  ? '0px 2px 8px var(--dark-gray)'
                  : '0px 2px 8px var(--white)',
            },
          },
        },
      }}
      name={name}
      value={value}
      onChange={onChange}
      IconComponent={() => (
        <span className="mr-2 text-[1.2rem]">
          <i className="fa-solid fa-angle-down"></i>
        </span>
      )}
      sx={{
        height: '40px',
        color: '#9CA3AF',
        borderRadius: '4px',
        border,
        boxShadow: 'none',
        '.MuiOutlinedInput-notchedOutline': {
          border: 0,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--primary)',
        },
        ...sx,
      }}
    >
      {children}
    </MuiSelect>
  );
}

export default memo(Select);
