(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('ManageTeachersController', ManageTeachersController)
        .controller('CreateTeacherController', CreateTeacherController)
        .controller('EditTeacherController', EditTeacherController)


    function ManageTeachersController($scope, API_admin, $mdDialog, lodash, $q, API_ROOT) {
        $scope.teacherImg = API_ROOT + '/v1/image/user/'
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
            return loadTeachers();
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
        function loadTeachers() {
            return API_admin.users.get();
        }

        $scope.skip = function(dessert, index) {
            return index >= ($scope.query.limit * ($scope.query.page - 1));
        };

        $scope.deleteSelectedTeachers = function() {
            var promises = [];

            lodash.forEach($scope.selected, function(item) {
                promises.push(API_admin.users.delete(item.id))
            })

            $q.all(promises).then(function() {
                $scope.teachers = lodash.difference($scope.teachers, $scope.selected);
                $scope.selected = [];
            });
        }

        loadTeachers().then(function(res) {
            $scope.allUsers = res.data;
            $scope.teachers = lodash.filter($scope.allUsers, function(e) {
                return e.role === "teacher";
            });
        }, function(err) {
            console.log('Get Courses error', err.data);
        });

    }




    function CreateTeacherController($scope, API_admin, Upload, $timeout, $state, lodash) {
        API_admin.classes.get().then(function(res) {
            $scope.classes = res.data
            console.log($scope.classes);
        }, function(err) {

        })
        $scope.createTeacher = function() {
            $scope.newTeacher.classes = lodash.map($scope.selectedClasses, function(e) {
                return e.id;
            });
            $scope.newTeacher.role = 'teacher';
            API_admin.users.post($scope.newTeacher).then(function(res) {
                $scope.createdTeacher = res.data;
                $scope.newTeacher = null;

                $scope.createTeacherForm.$setUntouched();

                console.log('Teacher created', res.data);

                $timeout(function() {
                    $scope.createdTeacher = null
                    $state.go('main.admin-manage-teachers');
                }, 1500);


            }, function(err) {
                $scope.error = err.data;
                $timeout(function() {
                    $scope.error = null
                }, 1500);
                console.log('Create Teacher error', err.data);
            })
        }



    }

    function EditTeacherController($scope, API_admin, $stateParams, $state, $timeout, lodash) {
        API_admin.users.get($stateParams.id).then(function(res) {
            $scope.teacher = res.data;
            console.log($scope.teacher);

            API_admin.classes.get().then(function(res) {
                $scope.classes = res.data;
                $scope.currentClasses = $scope.teacher.classes;
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


        $scope.editTeacher = function() {
            $scope.teacher.classes = lodash.map($scope.selectedClasses, function(e) {
                return e.id;
            });

            API_admin.users.put($stateParams.id, $scope.teacher).then(function(res) {
                $scope.updateTeacher = res.data;
                $scope.teacher = null;

                $scope.editTeacherForm.$setUntouched();

                console.log('Teacher updated', res.data);

                $timeout(function() {
                    $scope.createdTeacher = null;
                    $state.go('main.admin-manage-teachers')
                }, 2000);


            }, function(err) {
                $scope.error = err.data;
                $timeout(function() {
                    $scope.error = null
                }, 2000);
                console.log('Create teacher error', err.data);
            });
        }
    }


})();
