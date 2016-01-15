(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('ManageStudentsController', ManageStudentsController)
        .controller('CreateStudentController', CreateStudentController)
        .controller('EditStudentController', EditStudentController)


    function ManageStudentsController($scope, API_admin, $mdDialog, lodash, $q, API_ROOT) {
        $scope.studentImg = API_ROOT + '/v1/image/user/'
        var bookmark;

        $scope.selected = [];

        $scope.filter = {
            options: {
                debounce: 200
            }
        };

        $scope.query = {
            filter: '',
            order: 'name',
            limit: 5,
            page: 1
        };

        $scope.onOrderChange = function(order) {
            // return $nutrition.desserts.get($scope.query, success).$promise;
        };

        $scope.onPaginationChange = function(page, limit) {
            return loadStudents();
        };

        $scope.removeFilter = function() {
            $scope.filter.show = false;
            $scope.query.filter = '';

            if ($scope.filter.form.$dirty) {
                $scope.filter.form.$setPristine();
            }
        };

        // $scope.$watch('query.filter', function(newValue, oldValue) {
        //     if (!oldValue) {
        //         bookmark = $scope.query.page;
        //     }

        //     if (newValue !== oldValue) {
        //         $scope.query.page = 1;
        //     }

        //     if (!newValue) {
        //         $scope.query.page = bookmark;
        //     }

        //     loadCourses();
        // });

        //Get cources
        function loadStudents() {
            return API_admin.users.get();
        }

        $scope.skip = function(dessert, index) {
            return index >= ($scope.query.limit * ($scope.query.page - 1));
        };

        $scope.deleteSelectedStudents = function() {
            var promises = [];

            lodash.forEach($scope.selected, function(item) {
                promises.push(API_admin.users.delete(item.id))
            })

            $q.all(promises).then(function() {
                $scope.students = lodash.difference($scope.students, $scope.selected);
                $scope.selected = [];
            });
        }

        loadStudents().then(function(res) {
            $scope.allUsers = res.data;
            $scope.students = lodash.filter($scope.allUsers, function(e) {
                return e.role === "user";
            });
        }, function(err) {
            console.log('Get Courses error', err.data);
        });

    }




    function CreateStudentController($scope, API_admin, Upload, $timeout, $state, lodash) {
        API_admin.classes.get().then(function(res) {
            $scope.classes = res.data
            console.log($scope.classes);
        }, function(err) {

        })
        $scope.createStudent = function(student) {
            $scope.newStudent.classes = lodash.map($scope.selectedClasses, function(e) {
                return e.id;
            });
            $scope.newStudent.role = 'user';
            API_admin.users.post($scope.newStudent).then(function(res) {
                $scope.createdStudent = res.data;
                $scope.newStudent = null;

                $scope.createStudentForm.$setUntouched();

                console.log('Student created', res.data);

                $timeout(function() {
                    $scope.createdStudent = null
                    $state.go('main.admin-manage-students');
                }, 1500);


            }, function(err) {
                $scope.error = err.data;
                $timeout(function() {
                    $scope.error = null
                }, 1500);
                console.log('Create Student error', err.data);
            })
        }



    }

    function EditStudentController($scope, API_admin, $stateParams, $state, $timeout, lodash) {
        API_admin.users.get($stateParams.id).then(function(res) {
            $scope.student = res.data;
            console.log($scope.student.classes);

            API_admin.classes.get().then(function(res) {
                $scope.classes = res.data;
                $scope.currentClasses = $scope.student.classes;
                for (var i = 0; i < $scope.classes.length; i++) {
                    for (var j = 0; j < $scope.currentClasses.length; j++) {
                        if ($scope.classes[i].id === $scope.currentClasses[j]) {
                            $scope.selectedClasses.push($scope.classes[i]);
                        }
                    }
                }

            }, function(err) {
                console.log('Get classes error', err.data);
            });
            
        });


        $scope.editStudent = function() {
             $scope.student.classes = lodash.map($scope.selectedClasses, function(e) {
                return e.id;
            });

            API_admin.users.put($stateParams.id, $scope.student).then(function(res) {
                $scope.updateStudent = res.data;
                $scope.student = null;

                $scope.editStudentForm.$setUntouched();

                console.log('Student updated', res.data);

                $timeout(function() {
                    $scope.createdStudent = null;
                    $state.go('main.admin-manage-students')
                }, 2000);


            }, function(err) {
                $scope.error = err.data;
                $timeout(function() {
                    $scope.error = null
                }, 2000);
                console.log('Create Student error', err.data);
            });
        }
    }


})();
