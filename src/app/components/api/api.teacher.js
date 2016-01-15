(function() {
    'use strict';

    angular.module('NTA.admin')

    .factory('API_teacher', API_teacher);

    function API_teacher(API_ROOT, $http) {

        var getUser = function() {
            return $http.get(API_ROOT + '/v1/user');
        };
        var login = function(body) {
            return $http.post(API_ROOT + '/v1/login', {
                email : body.email,
                password: body.pass
            });
        };
        var logout = function() {
            return $http.post(API_ROOT + '/v1/logout');
        };

        var getClasses = function() {
            return $http.get(API_ROOT + '/v1/classes');
        };
        var postClasses = function(body) {
            return $http.post(API_ROOT + '/v1/classes', body);
        };


        var getCourses = function(classId) {
            return $http.get(API_ROOT + '/v1/classes/' + classId + '/courses');
        };
        var postCourses = function(classId, body) {
            return $http.post(API_ROOT + '/v1/classes/' + classId + '/courses', body);
        };


        var getEpisodes = function(semesterId) {
            return $http.get(API_ROOT + '/v1/courses/' + semesterId + '/episodes');
        };
        var postEpisodes = function(semesterId, body) {
            return $http.post(API_ROOT + '/v1/courses/' + semesterId + '/episodes', body);
        };
        var deleteEpisodes = function  (episodeId) {
            return $http.delete(API_ROOT + '/v1/courses/' + episodeId + '/episodes');
        
        };


        var getScenes = function(episodeId) {
            return $http.get(API_ROOT + '/v1/episodes/' + episodeId + '/scenes');
        };

        var postScenes = function(episodeId, body) {
            return $http.post(API_ROOT + '/v1/episodes/' + episodeId + '/scenes', body);
        };
        var uploadImg = function  (sceneId, file) {
            var fd = new FormData();
            fd.append('file', file);
            return $http.post(API_ROOT + '/v1/scenes/' + sceneId + '/image', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        }


        var getTasks = function(sceneId) {
            return $http.get(API_ROOT + '/v1/scenes/' + sceneId + '/tasks');
        };
        var postTasks = function(sceneId, body) {
            return $http.post(API_ROOT + '/v1/scenes/' + sceneId + '/tasks', body);
        };


        var getStudents = function(classId) {
            return $http.get(API_ROOT + '/v1/classes/' + classId + '/users');
        };


        var getCharacters = function () {
            return $http.get(API_ROOT + '/v1/characters');
        };
        var postCharacters = function (name, desc, file) {
            var fd = new FormData();
            fd.append('name', name);
            fd.append('desc', desc);
            fd.append('file', file);
            return $http.post(API_ROOT + '/v1/characters', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        };
        var postTaskCharacter = function (taskId, body) {
            return $http.post(API_ROOT + '/v1/characters/tasks/'+taskId, body);
        };

        var getLocations = function (argument) {
            return $http.get(API_ROOT + '/v1/locations');
        };
         var postLocation = function (name, desc, file, lon, lat) {
            var fd = new FormData();
            fd.append('name', name);
            fd.append('desc', desc);
            fd.append('file', file);
            fd.append('lon', lon);
            fd.append('lat', lat);
            return $http.post(API_ROOT + '/v1/locations', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        };
        var postTaskLocation = function (taskId, body) {
             return $http.post(API_ROOT + '/v1/locations/tasks/'+taskId, body);
        };





        var getImages = function (argument) {
            return $http.get(API_ROOT + '/v1/mediabank');
        }

        return {
            user: {
                get: getUser,
                login: login,
                logout: logout
            },
            tasks: {
                get: getTasks,
                create: postTasks,
                // updata: putTasks,
                // delete: deleteTasks
            },
            scenes: {
                get: getScenes,
                create: postScenes,
                uploadImg: uploadImg,
                // update: putScenes,
                // delete: deleteScenes
            },
            episodes: {
                get: getEpisodes,
                create: postEpisodes,
                // update: putEpisodes,
                delete: deleteEpisodes
            },
            courses: {
                get: getCourses,
                create: postCourses
                // update: putcourses,
                // delete: deletecourses
            },
            classes: {
                get: getClasses,
                create: postClasses,
                // update: putclasses,
                // delete: deleteclasses
            },
            students: {
                get: getStudents
            },
            characters: {
                get: getCharacters,
                create: postCharacters,
                createForTask: postTaskCharacter,
            },
            locations: {
                get: getLocations,
                create: postLocation,
                createForTask: postTaskLocation,
            },
            mediaBank: {
                get: getImages,
            }
        };
    }

})();
