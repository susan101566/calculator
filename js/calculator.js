$(function() {
  $(".draggable").draggable({ 
    containment:".calculator",
    helper: "clone"
  });

  $(".droppable").droppable({
    tolerance: 'fit',
    drop: function( event, ui ) {
            $( ".droppable" ).addClass('dropClass');
            angular.element('.conversion').scope()
              .changeEntry(angular.element('.calculator').scope().curEntry);
          }
  });
});


calculatorController = function($scope) {
  this.scope_ = $scope;

  /**
   * The buttons on the calcualtor.
   * @expose
   */
  $scope.opToName = [];

  /**
   * The current entry in the text.
   * @expose
   */
  $scope.curEntry = '';

  /**
   * True if an expression was just evaluated.
   * @expose
   */
  $scope.done = false;

  /**
   * A list of saved expressions in terms of x.
   * @expose
   */
  $scope.savedExp = [];

  this.populateOperators_();

  $scope.enter = function(op) {
    switch (op) {
      case 'DEL':
        // If an expression has just been calculated, clear input.
        if ($scope.done) {
          $scope.curEntry = '';
          $scope.done = false;
        }
        // Otherwise, delete the most recent character.
        else {
          $scope.curEntry = $scope.curEntry.slice(0, -1);
        }
        break;
     case '=':
        if ($scope.curEntry.indexOf('x') != -1) {
          $scope.savedExp.push($scope.curEntry);
          $scope.curEntry = '';
          break;
        }
        // Evaluate expression.
        if (!$scope.done && $scope.curEntry.length > 0) {
          $scope.curEntry = compute($scope.curEntry);
          $scope.done = true;
        }
        break;
     default:
        if ($scope.done) {
          $scope.done = false;
          // If the current entry is a number, then replace input.
          if (isBound(op)) {
            $scope.curEntry = op;
            break;
          }
          // If the input is a valid number, then append to it.
          if (isBound($scope.curEntry)) {
            $scope.curEntry += op;
            break;
          }
          // If neither the input nor the op has a valid number.
          // Clear input.
          $scope.curEntry = '';
        }
        // If the input is empty, and an operation is clicked,
        // Prefix with 0.
        if ($scope.curEntry.length == 0 && op != '-' && isOperator(op)) {
          $scope.curEntry = '0' + op;
        } else if (hasValidPrefix($scope.curEntry, op)) {
          $scope.curEntry += op;
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
  var buttons = [
    ['x', '(', ')', 'DEL'],
    ['7', '8', '9', '+'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '*'],
    ['0', '.', '=', '/']
  ];

  this.scope_.buttons = buttons;

  for (var i = 0; i < buttons.length; i++) {
    for (var j = 0; j < buttons[0].length; j++) {
      this.scope_.opToName[buttons[i][j]] = 'operator';
    }
  }

  for (var i = 0; i < 10; i++) {
    this.scope_.opToName[i.toString()] = 'digit';
  }

  this.scope_.opToName['='] = 'equal';
  this.scope_.opToName['x'] += ' variable';
  this.scope_.opToName['DEL'] += ' delete';
}

