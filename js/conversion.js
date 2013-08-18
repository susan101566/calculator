
conversionController = function($scope) {
  $scope.fromEntry = '90';
  $scope.toEntry = '120';
  $scope.curUnit = 'F';
  $scope.toUnit = 'C';
  $scope.conversionMode = 'Temperature';

  $scope.changeEntry = function(a) {
    $scope.fromEntry = a;
    $scope.$apply();
  };

  $scope.$watch('fromEntry', function() {
    window.console.log($scope.fromEntry);
    $scope.toEntry = parseFloat($scope.fromEntry * 2).toString();
  });

};
