/**
 * The computing logic behind the calculator.
 * Featuring compute, which takes in a string and evaluates to a number
 * in type string.
 */


/**
 * Parses the raw expression into understandable format.
 * Calls eval, then return the result.
 *
 * @param {string} expression The expression to evaluate
 * @return {string} The result, or 'Error' if NaN is returned
 *     or invalid expression.
 */
function compute(expression) {
  // No input has been entered yet, return 0.
  if (expression.length == 0) {
    return '0';
  }
  if (isValidInput_(expression)) {
    try {
      var result = eval(preprocess_(expression));
      if (!isNaN(result)) {
        return result.toString();
      }
    } catch (err) {
    }
  }
 return 'Error';
}


/**
 * Substitute all occurences of 'x' in expression with value
 * and evaluate the result.
 *
 * @param {string} expression The expression that could contain 'x'.
 * @param {number} value The value to substitute for 'x'.
 * @return {string} The evaluated result.
 */
function computeWithValue(expression, value) {
  var parsedString = expression.replace('x', '(' + value + ')');
  return compute(parsedString);
}


/**
 * Validate input. The built in function, eval(), is dangerous.
 * Make sure only evaluating on mathematical symbols.
 *
 * @param {string} expression The expression to validate.
 * @return {boolean}
 * @private
 */
function isValidInput_(expression) {
  for (var i = 0; i < expression.length; i++) {
    var c = expression.charAt(i);
    if (!(isBound(c) || isOperator(c) || c == '.' || c == '(' || c == ')')) {
      return false;
    }
  }
  return true;
}


/**
 * True if the input can be parsed into a number.
 *
 * @param {string} expression The input to parse.
 * @return {boolean}
 */
function isBound(expression) {
  var value = parseFloat(expression);
  return !isNaN(value) && isFinite(value);
}


/**
 * True if the expression is one of +,-,* or /
 *
 * @param {string} expression
 * @return {boolean}
 */
function isOperator(expression) {
  return expression == '+' || expression == '-' ||
    expression == '*' || expression == '/';
}


/**
 * True if op can be added to prefix to form a valid
 * prefix to be evaluated. Only perform some trivial tests.
 *
 * @param {string} prefix The prefix seen so far, assume to be valid.
 * @param {string} op The symbol to be added to the prefix.
 * @return {boolean}
 */
function hasValidPrefix(prefix, op) {
  var previous = prefix.charAt(prefix.length - 1);
  // If op is a digit.
  if (isBound(op)) {
    return previous != ')';
  }

  var invalidPrevious = isOperator(previous) ||
    previous == '(' || previous == '.';

  // If op is an operator.
  if (isOperator(op)) {
    return !invalidPrevious ||
      (op == '-' && (prefix.length == 0 || previous == '('));
  }

  // Other cases. Mainly found by observation.
  switch (op) {
    case '.':
      // .. and ). is invalid.
      if (previous == op || previous == ')') {
        return false;
      }

      // .12345. is not valid.
      var lastOccurr = prefix.lastIndexOf('.');
      if (lastOccurr == -1) {
        return true;
      }
      for (var i = lastOccurr + 1; i < prefix.length; i++) {
        if (!isBound(prefix.charAt(i))) {
          return true;
        }
      }
      return false;
    // .( is not valid.
    case '(':
      return previous != '.';
    case ')':
      // +) and () are not valid.
      if (invalidPrevious) {
        return false;
      }

      // Mismatch parens.
      var numLpar = 0, numRpar = 0;
      for (var i = 0; i < prefix.length; i++) {
        if (prefix.charAt(i) == '(') {
          numLpar += 1;
        } else if (prefix.charAt(i) == ')') {
          numRpar += 1;
        }
      }
      return numLpar > numRpar;
    default:
      return false;
  }
}


/**
 * Increase the tolerance for invalid expressions.
 * Try to add in hidden multiply signs.
 *
 * @param {string} expression The expression to be evaluated.
 * @return {string} The processed expression.
 */
function preprocess_(expression) {
  var result = [];
  for (var i = 0; i < expression.length; i++) {
    var previous = i == 0 ? undefined : expression[i-1];
    // Try to interpret hidden multiply.
    if (expression[i] == '(' &&
        (isBound(previous) || previous == ')')) {
      result.push('*');
    }
    result.push(expression[i]);
  }
  return result.join('');
}


/******************** Deprecated: use eval() ********************/
/**
 * Evaluate a mathematical expression.
 *
 * @param {string} exp The expression to be evaluated.
 * @return {string|NaN} The number the expression evaluates to.
 * @private
 */
function calculate_(exp) {
  var result;
  var startLeftParen = exp.indexOf('(');
  var curExp = exp;
  while (startLeftParen != -1) {
    var endRightParen = findRightParen_(curExp);
    if (endRightParen == -1) {
      return NaN;
    }
    curExp = curExp.substring(0, startLeftParen) +
      calculate_(curExp.substring(startLeftParen + 1, endRightParen)) +
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
 * @return {number|NaN} The parsed number.
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
    return '~' + Math.abs(number).toFixed(sig);
  }
  return number.toFixed(sig).toString();
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

