(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .directive('sidebarLeft', sidebarLeft);
        // .controller('LogoutModalController', LogoutModalController);

    function sidebarLeft() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/sidebar/sidebar-left.html',
            scope: {
                toggleRight: '='
            },
            controller: SidebarLeftController,
            controllerAs: 'vm',
            bindToController: true,
            link: linkFunc,
            transclude: false
        };

        return directive;

        function linkFunc($scope) {

        }

        /** @ngInject */
        function SidebarLeftController($scope, $mdSidenav, $mdDialog, ntaUser, $state) {
            // $scope.showUserMenu = null;
            $scope.User = ntaUser;
            $scope.avatar = ntaUser.getAvatar();
            
            $scope.toggleSubmenu = function($event) {
                angular.element($event.target).parent().toggleClass('toggled');
                angular.element($event.target).parent().find('ul').stop(true, false).slideToggle(200);
            };
            
            $scope.closeSidebar = function(){
                $mdSidenav('left-sidebar').close()
            }
            // $scope.showLogoutModal = function($event) {
            //         $mdDialog.show({
            //             targetEvent: $event,
            //             templateUrl: 'app/components/sidebar/logout.modal.html',
            //             controller: 'LogoutModalController',
            //             onComplete: afterShowAnimation,
            //         });
                    
            //         //will be executed after modal appears
            //         function afterShowAnimation(scope, element, options) {
            //             // post-show code here: DOM element focus, etc.
            //         }
            //     };
                // "vm.creation" is avaible by directive option "bindToController: true"
        }
    }

    // function LogoutModalController($scope, $mdDialog, ntaUser) {
    //     $scope.logout = function() {
    //         ntaUser.logout();
    //         $mdDialog.hide();
    //     };

    //     $scope.closeDialog = function() {
    //         $mdDialog.hide();
    //     };
    // }
    
})();
