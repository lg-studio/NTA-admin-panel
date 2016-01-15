(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($scope, ntaUser, $state, $localStorage) {
        $scope.showLogin = true;
        $scope.showForgot  =false
        // $scope.credentials;
        if (ntaUser.isLoggedIn()) {
            $state.go('main.profile');
            return;
        }

        $scope.login = function() {
            ntaUser.login($scope.credentials.email, $scope.credentials.password)
                .then(function(res) {
                    $localStorage.user = res.data;
                    if(ntaUser.isTeacher()){
                        $state.go('main.teacher-home');
                    }else{
                        $state.go('main.admin-home');
                    }
                }, function(error) {
                    $scope.error = error.data ? error.data.error : 'Unknown reason, please try again later.';
                });


        };
    }

})();
