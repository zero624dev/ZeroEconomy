module.exports = {
  randomRange: (min, max, allValues) => {
    const randomValue = Math.random() * (max - min + 1) + min;
    return allValues ? randomValue : Math.floor(randomValue);
  },
  randomArray: (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  randomBoolean: () => {
    return Math.random() < 0.5;
  },
  averageArray: (arr) => {
    return arr.reduce((a, b) => {
      return a + b;
    }, 0) / arr.length;
  },
  roundToDecimal: (value, decimals) => {
    return parseFloat(value, 10).toFixed(decimals);
  },
  factorial: (n) => {
    return n == 0 ? 1 : n * module.exports.factorial(n - 1);
  },
  percentage: (n, total, precision = 0) => {
    return module.exports.roundToDecimal(n / total * 100 || 0, precision);
  },
  isEven: (n) => {
    return n % 2 == 0;
  },
  isOdd: (n) => {
    return Math.abs(n % 2) == 1;
  }
};
