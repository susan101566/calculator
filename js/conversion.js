
/**
 * A hardcoded library of conversion units.
 */
var conversionDictionary = {
  'Weight': {
    'kg': {'g': '1000*x'},
    'g': {'kg': '0.001*x'}
  },
  'Length': {
    'km': {'m': '1000*x'},
    'm': {'km': '0.001*x'}
  }
};


/**
 * The Angular controller for conversion.
 */
conversionController = function($scope) {
  this.scope_ = $scope;
  var self = this;

  /**
   * The drop event listener.
   * @param{string} n The number dropped.
   */
  $scope.changeEntry = function(n) {
    $scope.fromEntry = n;
    $scope.$apply();
  };

  /**
   * The update function for all elements in the conversion panel.
   * @private
   */
  $scope.update_ = function() {
    if ($scope.fromEntry.length > 0) {
      $scope.toEntry = self.convert($scope.conversionMode,
          $scope.curUnit.name, $scope.toUnit, $scope.fromEntry);
    }
  };

  /**
   * Watch method for user entering input to convert.
   */
  $scope.$watch('fromEntry', $scope.update_);

  /**
   * Watch method for user changing unit to convert from.
   */
  $scope.$watch('curUnit', function() {
    $scope.conversionMode = self.getConversionMode($scope.curUnit);
    $scope.toUnits = self.getAllUnits($scope.conversionMode);
    if ($scope.toUnits.length > 0) {
      $scope.toUnit = $scope.toUnits[0];
      $scope.update_();
    }
  });

  /**
   * Watch method for user changing destination unit.
   */
  $scope.$watch('toUnit', $scope.update_);

  this.populateUnits();
};


/**
 * Populate all units that the converter supports.
 * @TODO: find a service to do this.
 */
conversionController.prototype.populateUnits = function() {
  this.scope_.allUnits = [
    {name: 'kg', mode: 'Weight'}, {name: 'g', mode: 'Weight'},
    {name: 'm', mode: 'Length'}, {name: 'km', mode: 'Length'}
  ];

  this.scope_.unitFilters = {};
  for (var i = 0; i < this.scope_.allUnits.length; i++) {
    var entry = this.scope_.allUnits[i];
    if (!this.scope_.unitFilters[entry.mode]) {
      this.scope_.unitFilters[entry.mode] = [entry.name];
    } else {
      this.scope_.unitFilters[entry.mode].push(entry.name);
    }
  }

  this.scope_.fromEntry = '0';
  this.scope_.toEntry = '0';
  this.scope_.curUnit = this.scope_.allUnits[0];
  this.scope_.toUnit = 'g';
  this.scope_.conversionMode = 'Weight';
  this.scope_.toUnits = this.scope_.unitFilters[this.scope_.conversionMode];
};


/**
 * Method of conversion.
 *
 * @param {string} mode The conversion mode. E.g. 'Temperature'.
 * @param {string} fromUnit The unit to convert from. E.g. 'F'.
 * @param {string} toUnit The unit to convert to. E.g. 'C'.
 * @param {string} entry The value to convert.
 * @return {string} The evaluated result, or 'Error' if input is invalid.
 * @TODO: find a service to do this.
 */
conversionController.prototype.convert =
    function(mode, fromUnit, toUnit, entry) {
  if (fromUnit == toUnit) {
    return entry.toString();
  }
  var result = parseFloat(entry);
  var equation = conversionDictionary[mode][fromUnit][toUnit];
  if (!equation) {
    return '0';
  }
  return computeWithValue(equation, result);
};


/**
 * Get the conversion mode of the unit.
 * @param {Object} unit The object with name and mode,
 *     e.g. {name: 'kg', mode: 'Weight'}.
 * @return {string} The mode found.
 * TODO: Find a service to do this.
 */
conversionController.prototype.getConversionMode = function(unit) {
  return unit.mode;
};


/**
 * Get a list of units that the given mode contains.
 * E.g. 'Temperature' would return ['C', 'F'].
 * 
 * @param {string} mode The mode to look for units.
 * @return {Array.<string>} The matching units in a list.
 * @TODO: find a service to do this.
 */
conversionController.prototype.getAllUnits = function(mode) {
  if (mode == 'Length') {
    return ['m', 'km'];
  }
  if (mode == 'Weight') {
    return ['g', 'kg'];
  }
  return [];
};

