import { Role } from '../constants/user.constants';
import { SetMetadata } from '@nestjs/common';
import { METADATA_ROLE_KEY } from '../constants/metadata.constant';

export const Roles = (...roles: Role[]) =>
  SetMetadata(METADATA_ROLE_KEY, roles);
