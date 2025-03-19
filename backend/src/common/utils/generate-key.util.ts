const KeyGenerator = {
  tokenBlacklistKey: (jti: string) => {
    return `TOKEN_BLACK_LIST_${jti}`;
  },
  otpToVerifyAccountKey: (accountId: number) => {
    return `auth:verify-account:${accountId}`
  }
};

export default KeyGenerator;
