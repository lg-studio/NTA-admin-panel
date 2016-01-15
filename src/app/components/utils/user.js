(function() {
    'use strict';
    angular.module('NTA.admin')

    .factory('ntaUser', ntaUser);

    function ntaUser($localStorage, $injector, API_ROOT) {

        function login(email, password) {
            var API_teacher = $injector.get('API_teacher');// fix for avoiding circular dependency error in TokenInjector
            return API_teacher.user.login({
                'email': email,
                'pass': password
            });
        }


        function logout() {
            var API_teacher = $injector.get('API_teacher'); // fix for avoiding circular dependency error in TokenInjector
            API_teacher.user.logout().then(function(e) {
                releaseUser();
            }, function(){
                releaseUser();
            });
        }

        function releaseUser() {
            var $state = $injector.get('$state');
            $localStorage.user = null;
            delete $localStorage.user;
            $state.go('login');
        }

        function isPresent() {
            return Boolean($localStorage.user);
        }

        function getAvatar(){
            return API_ROOT + "/v1/image/user/" + $localStorage.user.id;
        }

        function isLoggedIn() {
            return isPresent(); //&& accessToken.isValid();
        }

        function isTeacher() {
            return isPresent() ? $localStorage.user.role == 'teacher' : false;
        }

        function isAdmin() {
            return isPresent() ? $localStorage.user.role == 'admin' : false;
        }

        // TODO: uncomment when token will have expiration date
        // function isValidToken(){
        //     if (!$localStorage.user.token) {
        //         return false;
        //     } else {
        //         return Date.now() < Date.parse($localStorage.user.token.expire);
        //     }
        // }

        return {
            login: login,
            logout: logout,
            isLoggedIn: isLoggedIn,
            isAdmin: isAdmin,
            isTeacher: isTeacher,
            releaseUser: releaseUser,
            getAvatar: getAvatar,
            get profile() {
                return isPresent() ? $localStorage.user : null;
            }
        };

    }

})();
