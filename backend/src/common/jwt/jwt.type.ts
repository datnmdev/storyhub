export class Token {
  accessToken: string;
  refreshToken: string;
}

export class JwtPayload {
  id: number;
  role: number;
  status: number;
  iat?: number;
  exp?: number;
  jti?: string;
}
