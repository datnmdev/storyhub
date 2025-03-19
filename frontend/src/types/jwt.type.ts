import { Role, UserStatus } from "@constants/user.constants";

export interface JwtPayload {
  id: number;
  role: Role;
  status: UserStatus;
  iat: number;
  exp: number;
  jti: number;
}
