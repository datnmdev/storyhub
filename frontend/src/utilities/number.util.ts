const NumberUtils = {
  formatNumberWithSeparator(
    numberString: string,
    separator: string = ','
  ): string {
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  },
  formatNumber(number: number) {
    if (number < 1000) {
      return number.toString();
    } else if (number < 1_000_000) {
      return (number / 1_000).toFixed(1) + 'K';
    } else if (number < 1_000_000_000) {
      return (number / 1_000_000).toFixed(1) + 'M';
    } else {
      return (number / 1_000_000_000).toFixed(1) + 'B';
    }
  },
  roundToDecimal(number: number, decimalPlaces: number) {
    if (typeof number !== 'number' || typeof decimalPlaces !== 'number') {
      throw new Error('Cả number và decimalPlaces phải là số.');
    }
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
  },
};

export default NumberUtils;
