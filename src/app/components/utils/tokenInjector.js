(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .service('TokenInjector', TokenInjector);

    function TokenInjector($q, $localStorage, ntaUser) {
        return {
            request: function(config) {
                var user = $localStorage.user;

                // if (user) {
                //     config.headers.Authorization = user.token;
                // }
                var profile = ntaUser.profile;

                if (profile && profile.token) {
                    config.headers.Authorization = profile.token;
                }
                return config;
            },

            responseError: function(response) {
                if (response.status === 401 || response.status === 403 || response.status === 405) {
                    var user = $localStorage.user;

                    //TODO: uncoment when issue with error handling on server will be fixed
                    // if (response.status === 401) {
                    //     ntaUser.releaseUser();
                    // }
                }
                return $q.reject(response);
            }
        };
    }

})();
