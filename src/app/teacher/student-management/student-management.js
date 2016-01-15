(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('StudentManagementController', StudentManagementController);

    /** @ngInject */
    function StudentManagementController(API_teacher, $scope) {
         $scope.selected = [];

        //Get classes
        API_teacher.classes.get().then(function(res) {
            $scope.classes = res.data;
            console.log('Classes: ', $scope.classes);
        }, function(err) {
            console.log('Get Classes error', err.data);
        });
    }

})();
