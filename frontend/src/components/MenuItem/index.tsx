import { memo } from 'react';
import { MenuItemProps, MenuItem as MuiMenuItem } from '@mui/material';

function MenuItem(props: MenuItemProps) {
  return (
    <MuiMenuItem
      {...props}
      sx={{
        '&:hover': {
          backgroundColor: 'var(--primary)',
          color: 'var(--white)',
        },
        '&.Mui-selected': {
          backgroundColor: 'var(--primary)',
          color: 'var(--white)',
        },
      }}
    >
      {props.children}
    </MuiMenuItem>
  );
}

export default memo(MenuItem);
