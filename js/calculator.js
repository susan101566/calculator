
calculatorController = function($scope) {
  this.scope_ = $scope;

  /**
   * Map operators to their names.
   * @expose
   */
  $scope.opToName = {};

  /**
   * The current entry in the text.
   * @expose
   */
  $scope.curEntry = '';

  $scope.done = false;

  this.populateOperators_();

  var self = this;
  $scope.enter = function(op) {
    var curOp = op;
    switch (curOp) {
      case 'DEL':
        if ($scope.done) {
          $scope.curEntry = '';
          $scope.done = false;
        } else {
          $scope.curEntry = $scope.curEntry.slice(0, -1);
        }
        break;
     case '=':
        if (!$scope.done && $scope.curEntry.length > 0) {
          $scope.curEntry = compute($scope.curEntry);
          $scope.done = true;
        }
        break;
     default:
        if ($scope.done) {
          $scope.done = false;
          // If the current entry is a number, then replace input.
          if (isBound(curOp)) {
            $scope.curEntry = curOp;
            break;
          }
          // If the input is a valid number, then append to it.
          if (isBound($scope.curEntry)) {
            $scope.curEntry += curOp;
            break;
          }
          // If neither the input nor the op has a valid number.
          // Clear input.
          $scope.curEntry = '';
        } if ($scope.curEntry.length == 0 && isOperator(curOp)) {
          $scope.curEntry = '0' + curOp;
        } else {
          $scope.curEntry += curOp;
        }
        break;
    };
  };
};


/**
 * Populate the operators supported.
 *
 * @private
 */
calculatorController.prototype.populateOperators_ = function() {
  this.scope_.opToName = {
    'DEL': 'del',
    '(': 'lpar',
    ')': 'rpar',
    '.': 'dot',
    '+': 'plus',
    '-': 'minus',
    '*': 'times',
    '/': 'divide',
    '=': 'equal',
  };
  for (var i = 0; i < 10; i++) {
    this.scope_.opToName[i.toString()] = i.toString();
  }
}

