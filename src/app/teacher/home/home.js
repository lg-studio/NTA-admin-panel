(function() {
  'use strict';

  angular
      .module('NTA.admin')
      .controller('HomeTeacherController', HomeTeacherController);

  /** @ngInject */
  function HomeTeacherController($scope) {
    $scope.selected = []
  }

})();
