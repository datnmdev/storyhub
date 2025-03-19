import { Role } from '@constants/user.constants';
import { PropsWithChildren } from 'react';

export interface ProtectedProps extends PropsWithChildren {
  role: Role;
}
