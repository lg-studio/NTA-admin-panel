(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('ManageClassesController', ManageClassesController)
        .controller('CreateClassController', CreateClassController)
        .controller('EditClassController', EditClassController);

    function ManageClassesController($scope, API_admin, $q, lodash) {
        var bookmark;
        $scope.selected = []


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
            return loadClass();
        };

        $scope.removeFilter = function() {
            $scope.filter.show = false;
            $scope.query.filter = '';

            if ($scope.filter.form.$dirty) {
                $scope.filter.form.$setPristine();
            }
        };

        function loadClass() {
            return API_admin.classes.get();
        }

        $scope.skip = function(dessert, $index) {
            return index >= ($scope.query.limit * ($scope.query.page - 1));
        };

        $scope.deleteSelectedClasses = function() {
            function _deleteClass(index) {
                for (var i = 0; i < $scope.selected.length; i++) {
                    API_admin.classes.delete($scope.selected[i].id).then(function(res) {
                        console.log('Class deleted', res.data);
                    }, function(err) {
                        $scope.error = err.data;
                        console.log('Class delete error', err.data);
                    });
                }
            }

            $q.all($scope.selected.forEach(_deleteClass)).then(function() {
                $scope.classes = lodash.difference($scope.classes, $scope.selected);
                // loadCourses();
                $scope.selected = [];
            });
        };

        loadClass().then(function(res) {
            // .then(function(res) {
            $scope.class = res.data;
            console.log('class: ', $scope.class);
            // }, function(err) {
            //     console.log('Get Courses error', err.data);
            // });
        });


        API_admin.classes.get().then(function(res) {
            $scope.classes = res.data;
            console.log($scope.classes);
        }, function(err) {
            console.log('Get classes error', err.data);
        });

        API_admin.users.get().then(function(res) {
            $scope.users = res.data;
            console.log(res.data);
        }, function(err) {
            console.log('Get students error', err.data);
        });
    }



    function CreateClassController($scope, API_admin, lodash, API_ROOT, $timeout, $state) {
        $scope.userImg = API_ROOT + '/v1/image/user/';
        $scope.selectedCourses = [];
        $scope.selectedStudents = [];
        $scope.newClass = {};


        API_admin.users.get().then(function(res) {
            $scope.allUsers = res.data;
            $scope.students = lodash.filter($scope.allUsers, function(e) {
                return e.role === "user";
            });
            $scope.teachers = lodash.filter($scope.allUsers, function(e) {
                return e.role === "teacher";
            });
            console.log($scope.students);
        }, function(err) {
            console.log('Get Students error', err.data);
        });

        API_admin.courses.get().then(function(res) {
            $scope.courses = res.data;
            console.log($scope.students);
        }, function(err) {
            console.log('Get Students error', err.data);
        });

        $scope.createClass = function() {
            $scope.newClass.users = lodash.map($scope.selectedStudents, function(e) {
                return e.id
            });

            $scope.newClass.courses = lodash.map($scope.selectedCourses, function(e) {
                return e.id
            });

            $scope.newClass.tutor = $scope.newClass.selectedTeacher;

            console.log($scope.newClass);

            API_admin.classes.post($scope.newClass).then(function(res) {
                $scope.createdClass = res.data;
                $scope.newClass = null;

                $scope.createClassForm.$setUntouched();

                console.log('newClass created', res.data);

                $timeout(function() {
                    $scope.createdCourse = null
                    $state.go('main.admin-manage-classes');
                }, 2000);


            }, function(err) {
                $scope.error = err.data;
                $timeout(function() {
                    $scope.error = null
                }, 2000);
                console.log('Create course error', err.data);
            })
        }
    }




    function EditClassController($scope, API_admin, lodash, API_ROOT, $stateParams, $timeout, $state) {
        $scope.userImg = API_ROOT + '/v1/image/user/';
        $scope.selectedStudents = [];
        var updatedClass = {}



        API_admin.classes.get($stateParams.id).then(function(res) {
            $scope.class = res.data;
            console.log($scope.class.courses);

            API_admin.courses.get().then(function(res) {
                $scope.courses = res.data;
                $scope.currentCourses = $scope.class.courses;
                for (var i = 0; i < $scope.courses.length; i++) {
                    for (var j = 0; j < $scope.currentCourses.length; j++) {
                        if ($scope.courses[i].id === $scope.currentCourses[j]) {
                            $scope.selectedCourses.push($scope.courses[i]);
                        }
                    }
                }
            }, function(err) {
                console.log('Get Students error', err.data);
            });


            API_admin.users.get().then(function(res) {
                $scope.allUsers = res.data;
                $scope.students = lodash.filter($scope.allUsers, function(e) {
                    return e.role === "user";
                });
                $scope.teachers = lodash.filter($scope.allUsers, function(e) {
                    return e.role === "teacher";
                });

                $scope.currentStudents = $scope.class.users;
                for (var i = 0; i < $scope.students.length; i++) {
                    for (var j = 0; j < $scope.currentStudents.length; j++) {
                        if ($scope.students[i].id === $scope.currentStudents[j]) {
                            $scope.selectedStudents.push($scope.students[i]);
                        }
                    }
                }



            }, function(err) {
                console.log('Get Students error', err.data);
            });

        });




        $scope.editClass = function() {
            $scope.class.users = lodash.map($scope.selectedStudents, function(e) {
                return e.id
            });
            $scope.class.courses = lodash.map($scope.selectedCourses, function(e) {
                return e.id
            });
            
            if( $scope.class.selectedTeacher){
                $scope.class.tutor = $scope.class.selectedTeacher;
            }
            console.log($scope.class);
            updatedClass = {
                name: $scope.class.name,
                desc: $scope.class.desc,
                users: $scope.class.users,
                courses: $scope.class.courses,
                tutor: $scope.class.tutor

            }


            API_admin.classes.put($stateParams.id, updatedClass).then(function(res) {

                $scope.class = null;

                $scope.editClassForm.$setUntouched();

                console.log('Class updated', res.data);

                $timeout(function() {

                    $state.go('main.admin-manage-classes');
                }, 2000);


            }, function(err) {
                $scope.error = err.data;
                $timeout(function() {
                    $scope.error = null
                }, 2000);
                console.log('Create course error', err.data);
            })
        }
    }



})();
