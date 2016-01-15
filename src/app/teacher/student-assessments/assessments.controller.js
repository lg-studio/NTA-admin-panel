(function() {
    'use strict';

    angular
        .module('NTA.admin')
        // .constant('malarkey', malarkey)
        .controller('StudentAssessmentsController', StudentAssessmentsController);

    function StudentAssessmentsController($scope, API_teacher) {
        $scope.selected = [];
        
        $scope.tasks = [
            {
                name:"task 1",
                attachments: 5,
                done: 10
            },
            {
                name:"task 2",
                attachments: 6,
                done: 5
            },
            {
                name:"task 3",
                attachments: 3,
                done: 3
            },
            {
                name:"task 4",
                attachments: 8,
                done: 14
            },
            {
                name:"task 5",
                attachments: 2,
                done: 11
            }
        ];
    }
})();