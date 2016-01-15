(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                requiresAuth: false
            })

            .state('main', {
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
            })
            .state('main.404', {
                url:'/404',
                templateUrl: 'app/main/404.html',
                controller: 'MainController',
            })

            
            .state('main.profile', {
                url: '/profile',
                templateUrl: 'app/profile/profile.html',
                controller: 'ProfileController',
                requiresAuth: true
            })

            .state('main.student-assessments', {
                url: '/student-assessments',
                templateUrl: 'app/teacher/student-assessments/assessments.html',
                controller: 'StudentAssessmentsController'
            })

            .state('main.courses', {
                url: '/courses',
                templateUrl: 'app/content-management/courses/courses.html',
                controller: 'CoursesController'
            })

            .state('main.create-course', {
                url: '/create-course',
                templateUrl: 'app/content-management/courses/create-course.html',
                controller: 'CreateCourseController'
            })

            .state('main.edit-course', {
                url: '/edit-course?id',
                templateUrl: 'app/content-management/courses/edit-course.html',
                controller: 'EditCourseController'
            })

            .state('main.episodes', {
                url: '/episodes',
                templateUrl: 'app/content-management/episodes/episodes.html',
                controller: 'EpisodesController'
            })

            .state('main.create-episode', {
                url: '/create-episode',
                templateUrl: 'app/content-management/episodes/create-episode.html',
                controller: 'CreateEpisodeController'
            })

            .state('main.edit-episode', {
                url: '/edit-episode?id',
                templateUrl: 'app/content-management/episodes/edit-episode.html',
                controller: 'EditEpisodeController'
            })

            .state('main.scenes', {
                url: '/scenes',
                templateUrl: 'app/content-management/scenes/scenes.html',
                controller: 'ScenesController'
            })

            .state('main.create-scene', {
                url: '/create-scene',
                templateUrl: 'app/content-management/scenes/create-scene.html',
                controller: 'CreateSceneController'
            })
            .state('main.edit-scene', {
                url: '/edit-scene?id',
                templateUrl: 'app/content-management/scenes/edit-scene.html',
                controller: 'EditSceneController'
            })

            .state('main.tasks', {
                url: '/tasks',
                templateUrl: 'app/content-management/tasks/tasks.html',
                controller: 'TasksController'
            })

            .state('main.create-task', {
                url: '/create-task',
                templateUrl: 'app/content-management/tasks/create-task.html',
                controller: 'CreateTaskController'
            })
            .state('main.edit-task', {
                url: '/edit-task?id',
                templateUrl: 'app/content-management/tasks/edit-task.html',
                controller: 'EditTaskController'
            })

            .state('main.characters', {
                url: '/characters',
                templateUrl: 'app/content-management/characters/characters.html',
                controller: 'CharactersController'
            })

            .state('main.create-character', {
                url: '/create-character',
                templateUrl: 'app/content-management/characters/create-character.html',
                controller: 'CreateCharacterController'
            })
            .state('main.edit-character', {
                url: '/edit-character?id',
                templateUrl: 'app/content-management/characters/edit-character.html',
                controller: 'EditCharacterController'
            })
            .state('main.locations', {
                url: '/locations',
                templateUrl: 'app/content-management/locations/locations.html',
                controller: 'LocationsController'
            })
            .state('main.create-location', {
                url: '/create-location',
                templateUrl: 'app/content-management/locations/create-location.html',
                controller: 'CreateLocationController'
            })
            .state('main.edit-location', {
                url: '/edit-location?id',
                templateUrl: 'app/content-management/locations/edit-location.html',
                controller: 'EditLocationController'
            })

            .state('main.media-library', {
                url: '/media-library',
                templateUrl: 'app/content-management/media-library/media-library.html',
                controller: 'MediaLibraryController'
            })
            

            //teacher
            .state('main.teacher-home', {
                url: '/home',
                templateUrl: 'app/teacher/home/home.html',
                controller: 'HomeTeacherController',
                requiresAuth: true
            })

            .state ('main.student-management', {
                url: '/student-management',
                templateUrl: 'app/teacher/student-management/student-management.html',
                controller: 'StudentManagementController',
                requiresAuth: true
            })

            //admin
            .state('main.admin-home', {
                url: '/admin-home',
                templateUrl: 'app/admin/home/home.html',
                controller: 'HomeAdminController',
                requiresAuth: true
            })


            .state ('main.admin-manage-students', {
                url: '/manage-users',
                templateUrl: 'app/admin/users-management/students/students.html',
                requiresAuth: true,
                controller: 'ManageStudentsController'
            })
            .state('main.admin-create-student', {
                url: '/create-student',
                templateUrl: 'app/admin/users-management/students/create-student.html',
                controller: 'CreateStudentController'
            })
            .state('main.admin-edit-student', {
                url: '/edit-student?id',
                templateUrl: 'app/admin/users-management/students/edit-student.html',
                controller: 'EditStudentController'
            })



            .state ('main.admin-manage-teachers', {
                url: '/manage-teachers',
                templateUrl: 'app/admin/users-management/teachers/teachers.html',
                requiresAuth: true,
                controller: 'ManageTeachersController'
            })
            .state('main.admin-create-teacher', {
                url: '/create-teacher',
                templateUrl: 'app/admin/users-management/teachers/create-teacher.html',
                controller: 'CreateTeacherController'
            })
            .state('main.admin-edit-teacher', {
                url: '/edit-teacher?id',
                templateUrl: 'app/admin/users-management/teachers/edit-teacher.html',
                controller: 'EditTeacherController'
            })


            .state ('main.admin-manage-classes', {
                url: '/manage-classes',
                templateUrl: 'app/admin/users-management/classes/classes.html',
                requiresAuth: true,
                controller: 'ManageClassesController'
            })
            .state('main.admin-create-class', {
                url: '/create-class',
                templateUrl: 'app/admin/users-management/classes/create-class.html',
                controller: 'CreateClassController'
            })
             .state('main.admin-edit-class', {
                url: '/edit-class?id',
                templateUrl: 'app/admin/users-management/classes/edit-class.html',
                controller: 'EditClassController'
            })
            

        $urlRouterProvider.otherwise('/login');
    }

})();
