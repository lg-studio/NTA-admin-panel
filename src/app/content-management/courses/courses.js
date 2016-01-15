(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('CoursesController', CoursesController)
        .controller('CreateCourseController', CreateCourseController)
        .controller('EditCourseController', EditCourseController);



    /** @ngInject */
    function CoursesController(API_admin, $scope, $q, lodash) {
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
            return loadCourses();
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
        function loadCourses() {
            return API_admin.courses.get();
        }

        $scope.skip = function(dessert, index) {
            return index >= ($scope.query.limit * ($scope.query.page - 1));
        };

        $scope.deleteSelectedCourses = function() {
            var promises = [];

            lodash.forEach($scope.selected, function(item) {
                promises.push(API_admin.courses.delete(item.id))
            })

            $q.all(promises).then(function() {
                $scope.courses = lodash.difference($scope.courses, $scope.selected);
                $scope.selected = [];
            });
        }

        loadCourses().then(function(res) {
            // .then(function(res) {
            $scope.courses = res.data;
            console.log('Courses: ', $scope.courses);
            // }, function(err) {
            //     console.log('Get Courses error', err.data);
            // });
        });
    }

    function CreateCourseController($scope, $state, API_admin, $timeout, lodash) {

        API_admin.episodes.get().then(function(res) {
            $scope.episodes = res.data
        })

        $scope.createCourse = function() {
            $scope.newCourse.episodes = lodash.map($scope.selectedEpisodes, function(e) {
                return e.id
            });

            API_admin.courses.post($scope.newCourse).then(function(res) {
                // $scope.createdCourse = res.data;
                $scope.newCourse = null;
                $scope.createCourseForm.$setUntouched();
                $state.go('main.courses');

                // console.log('newCourse created', res.data);
                // $timeout(function() {
                //     $scope.createdCourse = null
                // }, 2000);

            }, function(err) {
                $scope.error = err.data;
                // $timeout(function() {
                //     $scope.error = null
                // }, 2000);
                console.log('Create course error', err.data);
            })
        }
    }

    function EditCourseController($scope, API_admin, API_teacher, $timeout, $stateParams, $state, lodash) {

        $scope.selectedEpisodes = [];

        API_admin.courses.get($stateParams.id).then(function(res) {
            $scope.course = res.data;
            console.log($scope.course)
        })

        API_admin.episodes.get().then(function(res) {
            $scope.episodes = res.data

            API_teacher.episodes.get($stateParams.id).then(function(res) {
                $scope.currentEpisodes = res.data
                    // console.log($scope.currentEpisode)

                for (var i = 0; i < $scope.currentEpisodes.length; i++) {
                    for (var j = 0; j < $scope.episodes.length; j++) {
                        if ($scope.currentEpisodes[i].id == $scope.episodes[j].id) {
                            $scope.selectedEpisodes.push($scope.episodes[j]);
                        }
                    }
                }

            })


        })


        $scope.editCourse = function() {

            $scope.course.episodes = lodash.map($scope.selectedEpisodes, function(e) {
                return e.id
            });

            API_admin.courses.put($stateParams.id, $scope.course).then(function(res) {
                $state.go('main.courses');
                // $scope.updatedCourse = res.data;
                // console.log($scope.updatedCourse);
                // $timeout(function() {
                //     $scope.updatedCourse = null
                //     $state.go('main.courses');
                // }, 1500);


            }, function(err) {
                $scope.error = err.data;
                console.log('Course updade error', err.data);
            })
        }
    }

})();
