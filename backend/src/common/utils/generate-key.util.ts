const KeyGenerator = {
  tokenBlacklistKey: (jti: string) => {
    return `TOKEN_BLACK_LIST_${jti}`;
  },
};

export default KeyGenerator;
