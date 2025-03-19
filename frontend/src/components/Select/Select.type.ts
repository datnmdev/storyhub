import { SelectChangeEvent } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';

export interface SelectProps extends PropsWithChildren {
  name?: string;
  value?: string;
  border?: string;
  onChange?: (event: SelectChangeEvent<string>, child: ReactNode) => void;
}
