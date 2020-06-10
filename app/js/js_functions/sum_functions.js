/* sum_functions.js */

module.exports = function exports() {
  // Convert arguments object to an array
  const args = Array.prototype.slice.call(arguments);

  // Throw error if arguments contain non-finite number values
  if (!args.every(Number.isFinite)) {
    throw new TypeError('sum() expects only numbers.');
  }

  // Return the sum of the arguments
  return args.reduce((a, b) => a + b, 0);
};
