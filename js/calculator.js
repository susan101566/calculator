
calculatorController = function($scope) {
  this.scope_ = $scope;
  $scope.name = 'Susan';

  /**
   * Map operators to their names.
   * @expose
   */
  $scope.opToName = {};

  this.populateOperators_();

  $scope.enter = this.enter;
}

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
    '=': 'equal'
  };
  for (var i = 0; i < 10; i++) {
    this.scope_.opToName[i.toString()] = i.toString();
  }
}


calculatorController.prototype.enter = function(op) {
  window.console.log(op);
}

