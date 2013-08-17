/**
 * @fileoverview
 *
 * The computing logic behind the calculator.
 * Featuring calculate, which takes in a string and evaluates to a number
 * in type string.
 */



/**
 * Evaluate a mathematical expression.
 *
 * @param {string} exp The expression to be evaluated.
 * @return {string} The number the expression evaluates to.
 */
function calculate(exp) {
  var result;
  var startLeftParen = exp.indexOf('(');
  var curExp = exp;
  while (startLeftParen != -1) {
    var endRightParen = findRightParen_(curExp);
    if (endRightParen == -1) {
      return NaN;
    }
    curExp = curExp.substring(0, startLeftParen) +
      calculate(curExp.substring(startLeftParen + 1, endRightParen)) +
      curExp.substring(endRightParen + 1, curExp.length);
    startLeftParen = curExp.indexOf('(');
  }
  var expArray = curExp.split(/([+-])/);
  // Only '*' and '/'.
  expArray = expArray.map(evaluateSimple_);
  return evaluateSimple_(expArray.join(''));
}


/**
 * Evaluate a mathematical expression naively from left to right.
 *
 * @param {string} exp The string expression to evaluate.
 * @return {string|NaN}
 * @private
 */
function evaluateSimple_(exp) {
  if (exp == '+' || exp == '-') {
    return exp;
  }

  var simpleExp = exp.split(/([\*+\/-])/);
  
  //Initialize the result to the first float.
  var result = parseFloatWithNeg_(simpleExp[0]);
  var curIndex = 1;

  // Evaluate expression from left to right.
  while (curIndex < simpleExp.length) {
    if (curIndex + 1 == simpleExp.length) {
      return NaN;
    }
    var nextNumber = parseFloatWithNeg_(simpleExp[curIndex + 1]);
    switch(simpleExp[curIndex]) {
      case '+':
          result += nextNumber;
        break;
      case '-':
          result -= nextNumber;
        break;
      case '*':
        result *= nextNumber;
        break;
      case '/':
        result /= nextNumber;
        break;
      default:
        return NaN;
    }
    curIndex += 2;
  }
  return encodeFloatWithNeg_(result);
}


/**
 * Takes a string and returns a float.
 *
 * @param {string} exp The string to parse the float.
 * @return {number} The parsed number.
 * @private
 */
function parseFloatWithNeg_(exp) {
  if (exp.charAt(0) == '~') {
    return -1 * parseFloat(exp.substring(1, exp.length));
  }
  return parseFloat(exp);
}


/**
 * Takes a float and returns a string.
 *
 * @param {number} number The number to convert.
 * @return {string} The resulting string.
 * @private
 */
function encodeFloatWithNeg_(number) {
  if (number < 0) {
    return '~' + Math.abs(number);
  }
  return number;
}


/**
 * Takes in a string and returns the index of the right
 * outermost paren.
 *
 * @param {string} exp The string to find the outer most right paren.
 * @return {number} The index or -1 if not found.
 * @private
 */
function findRightParen_(exp) {
  var leftParenIndex = exp.indexOf('(');
  if (leftParenIndex == -1) {
    return -1;
  }
  var sum = 1;
  for (var i = leftParenIndex + 1; i < exp.length; i++) {
    if (exp.charAt(i) == '(') {
      sum += 1;
    }
    if (exp.charAt(i) == ')') {
      sum -= 1;
    }
    if (sum == 0) {
      return i;
    }
  }
  return -1;
}

