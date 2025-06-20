const KeyGenerator = {
  tokenBlacklistKey: (jti: string) => {
    return `TOKEN_BLACK_LIST_${jti}`;
  },
  otpToVerifyAccountKey: (accountId: number) => {
    return `auth:verify-account:${accountId}`;
  },
  otpToResetPasswordKey: (accountId: number) => {
    return `auth:reset-password:${accountId}`;
  },
  stateToResetPasswordKey: (accountId: number) => {
    return `auth:reset-password:state:${accountId}`;
  },
  verifyChangePasswordInfoKey: (userId: number) => {
    return `change-password:verify-info:${userId}`;
  },
};

export default KeyGenerator;
