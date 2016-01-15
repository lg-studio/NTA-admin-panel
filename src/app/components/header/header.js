(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .directive('ntaHeader', ntaHeader);

    function ntaHeader() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/header/header.html',
            controller: HeaderController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function HeaderController($scope, $mdSidenav) {

                // "vm.creation" is avaible by directive option "bindToController: true"
        }
    }
})();
