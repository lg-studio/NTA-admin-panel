(function() {
  'use strict';

  angular
      .module('NTA.admin')
      .controller('HomeAdminController', HomeAdminController);

  /** @ngInject */
  function HomeAdminController($scope) {
    $scope.selected = [];
  }

})();
