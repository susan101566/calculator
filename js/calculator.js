$(function() {
  $(".draggable").draggable({ 
    containment:".calculator",
    revert: "invalid"
  });

  $(".droppable").droppable({
    tolerance: 'fit',
    over: function(event, ui) {
      $('.ui-dragable-dragging').addClass('hoverClass');
    },
    out: function(event, ui) {
           $('.ui-dragable-dragging').removeClass('hoverClass');
         },
    /** This is the drop event, when the dragable object is moved on the top of the dropable object area **/
    drop: function( event, ui ) {
            $( ".droppable" ).addClass('dropClass');
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
  this.scope_.buttons = [
    ['x', '(', ')', 'DEL'],
    ['7', '8', '9', '+'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '*'],
    ['0', '.', '=', '/']
  ];
  this.scope_.opToName = {
    'DEL': 'del',
    '(': 'lpar',
    ')': 'rpar',
    '.': 'dot',
    '+': 'plus',
    '-': 'minus',
    '*': 'times',
    '÷': 'divide',
    '=': 'equal',
    'x': 'x'
  };
  for (var i = 0; i < 10; i++) {
    this.scope_.opToName[i.toString()] = i.toString();
  }
}

