(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('MainController', MainController)
        .directive('fallbackSrc', fallbackSrc)

    function fallbackSrc() {
        var fallbackSrc = {
            link: function postLink(scope, iElement, iAttrs) {
                iElement.bind('error', function() {
                    angular.element(this).attr("src", iAttrs.fallbackSrc);
                });
            }
        }
        return fallbackSrc;
    }

    /** @ngInject */
    function MainController($scope, $mdSidenav, $mdComponentRegistry, $window) {
        $scope.toggleSidebar = function(sidebarID) {
            $mdSidenav('left-sidebar').toggle();
        };

        $scope.isLeftSidebarOpen = function() {
            // var leftSidebarInstance = $mdComponentRegistry.getInstances('left-sidebar');
            // leftSidebarInstance.close();
            // console.log('leftSidebarInstance', leftSidebarInstance);
            //  leftSidebarInstance.close();
            // console.log('leftSidebarInstance[[[]]]', $mdSidenav('left-sidebar').isOpen());
            // console.log('leftSidebarInstance &&', leftSidebarInstance && leftSidebarInstance.length > 0 && leftSidebarInstance[0].isOpen())
            // $mdSidenav('left-sidebarr').then(function(){
            //     return $mdSidenav('left-sidebarr').isOpen();
            // })//leftSidebarInstance && leftSidebarInstance.length > 0;
        };
        $scope.backToPrevPage = function() {
            $window.history.back();
        }
    }

})();
