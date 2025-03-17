import { Role } from '@constants/auth.constants';
import { PropsWithChildren } from 'react';

export interface ProtectedProps extends PropsWithChildren {
  role: Role;
}
