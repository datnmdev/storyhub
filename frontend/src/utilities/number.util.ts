const NumberUtils = {
  formatNumberWithSeparator(
    numberString: string,
    separator: string = ','
  ): string {
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  },
};

export default NumberUtils;
