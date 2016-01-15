(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('ProfileController', ProfileController);

    function ProfileController($scope, ntaUser, API_teacher) {
        $scope.User= ntaUser.profile;
        console.log($scope.User);
        $scope.avatar = ntaUser.getAvatar();
         API_teacher.classes.get().then(function(res) {
            $scope.classes = res.data;
        }, function(err) {
            console.log('Get groups error', err.data);
        });

        
    }
})();