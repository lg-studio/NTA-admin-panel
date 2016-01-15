(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $rootScope, ntaUser, $state) {

        $rootScope.$on('$stateChangeStart', function(event, toState) {
            var isLoggedIn = ntaUser.isLoggedIn();

            if (toState.requiresAuth && !isLoggedIn) {
                event.preventDefault();

                ntaUser.releaseUser();

            }
        });

        $log.debug('runBlock end');
    }

})();
