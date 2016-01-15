(function() {
    'use strict';

    angular.module('NTA.admin')

    .factory('API_admin', API_admin);


    function API_admin(API_ROOT, $http) {

        var getUsers = function(userId) {
            return userId ? $http.get(API_ROOT + '/v1/admin/users/'+userId) : $http.get(API_ROOT + '/v1/admin/users')
        };
        var postUser = function(body) {
            return $http.post(API_ROOT + '/v1/admin/users/', body);
        };
        var putUser = function(userId, body) {
            return $http.put(API_ROOT + '/v1/admin/users/' + userId, body);
        };
        var deleteUser = function(userId) {
            return $http.delete(API_ROOT + '/v1/admin/users/' + userId);
        };





        var getClasses = function(classId) {
             return classId ? $http.get(API_ROOT + '/v1/admin/classes/'+ classId):$http.get(API_ROOT + '/v1/admin/classes') ;
        };
        var postClass = function(body) {
            return $http.post(API_ROOT + '/v1/admin/classes/', body);
        };
        var putClass = function(classId, body) {
            return $http.put(API_ROOT + '/v1/admin/classes/' + classId, body);
        };
        var deleteClass = function(classId) {
            return $http.delete(API_ROOT + '/v1/admin/classes/' + classId);
        };



        var getCourses = function(courseId) {
            return courseId ? $http.get(API_ROOT + '/v1/admin/courses/' + courseId) : $http.get(API_ROOT + '/v1/admin/courses');
        };
        var postCourse = function(body) {
            return $http.post(API_ROOT + '/v1/admin/courses', body);
        };
        var putCourse = function(courseId, body) {
            return $http.put(API_ROOT + '/v1/admin/courses/' + courseId, body);
        };
        var deleteCourse = function(courseId) {
            return $http.delete(API_ROOT + '/v1/admin/courses/' + courseId);
        };



        var getEpisodes = function(episodeId) {
            return episodeId ? $http.get(API_ROOT + '/v1/admin/episodes/'+ episodeId):$http.get(API_ROOT + '/v1/admin/episodes') ;
        };
        var postEpisode = function(body) {
            return $http.post(API_ROOT + '/v1/admin/episodes', body);
        };
        var putEpisode = function (episodeId, body) {
            return $http.put(API_ROOT + '/v1/admin/episodes/'+episodeId, body);
        }
        var deleteEpisode = function(episodeId) {
            return $http.delete(API_ROOT + '/v1/admin/episodes/' + episodeId);
        };



        var getScenes = function(sceneId) {
            return sceneId ? $http.get(API_ROOT + '/v1/admin/scenes/'+ sceneId):$http.get(API_ROOT + '/v1/admin/scenes') ;
        };
        var postScene = function(body) {
            return $http.post(API_ROOT + '/v1/admin/scenes', body);
        };
        var putScene = function(sceneId, body) {
            return $http.put(API_ROOT + '/v1/admin/scenes/' + sceneId, body);
        };
        var deleteScene = function(sceneId) {
            return $http.delete(API_ROOT + '/v1/admin/scenes/' + sceneId);
        };


        var getTasks = function(taskId) {
            return taskId ? $http.get(API_ROOT + '/v1/admin/tasks/'+ taskId):$http.get(API_ROOT + '/v1/admin/tasks') ;
        };
        var postTask = function(body) {
            return $http.post(API_ROOT + '/v1/admin/tasks', body);
        };
        var putTask = function(taskId, body) {
            return $http.put(API_ROOT + '/v1/admin/tasks/' + taskId, body);
        };
        var deleteTask = function(taskId) {
            return $http.delete(API_ROOT + '/v1/admin/tasks/' + taskId);
            
        }

        var getCharacters = function (characterId) {
            return characterId ? $http.get(API_ROOT + '/v1/characters/' + characterId) : $http.get(API_ROOT + '/v1/characters');
        };
        
        var postCharacter = function (body) {
            return $http.post(API_ROOT + '/v1/characters', body);
        };

        var putCharacter = function (characterId, body) {
            return $http.put(API_ROOT + '/v1/characters/' + characterId, body);
        };
        
        var postTaskCharacter = function (characterId, body) {
            return $http.post(API_ROOT + '/v1/characters/tasks/' + characterId, body);
        };

        var deleteCharacter = function (characterId) {
            return $http.delete(API_ROOT + '/v1/characters/' + characterId);
        };



        var getLocations = function (locationId) {
            return locationId ? $http.get(API_ROOT + '/v1/locations/' + locationId) : $http.get(API_ROOT + '/v1/locations');
        }

        var postLocation = function  (body) {
           return $http.post(API_ROOT + '/v1/locations', body);
        }
        var putLocation = function  (locationId, body) {
           return $http.put(API_ROOT + '/v1/locations/'+locationId, body);
        }

        var deleteLocation = function  (locationId) {
           return $http.delete(API_ROOT + '/v1/locations/' + locationId);
        }

        var getImages = function () {
            return $http.get(API_ROOT + '/v1/mediabank');
        }

        var updloadImage = function (image) {
            var fd = new FormData();
            fd.append('file', image);
            return $http.post(API_ROOT + '/v1/mediabank', fd, {
                transformRequest: angular.identity,
            });
        }

        var deleteImages = function (imageId) {
            return $http.delete(API_ROOT + '/v1/mediabank/' + imageId);
        }


        return {
            users: {
                get: getUsers,
                post: postUser,
                put: putUser,
                delete: deleteUser
            },
            classes: {
                get: getClasses,
                post: postClass,
                delete: deleteClass,
                put: putClass
            },
            courses: {
                get: getCourses,
                post: postCourse,
                put: putCourse,
                delete: deleteCourse
            },
            episodes: {
                get: getEpisodes,
                post: postEpisode,
                put: putEpisode,
                delete: deleteEpisode,
            },
            scenes: {
                get: getScenes,
                post: postScene,
                put: putScene,
                delete: deleteScene,
            },
            tasks: {
                get: getTasks,
                post: postTask,
                put: putTask,
                delete: deleteTask,
            },
            characters: {
                get: getCharacters,
                post: postCharacter,
                put: putCharacter,
                createForTask: postTaskCharacter,
                delete: deleteCharacter
            },
            locations:{
                get: getLocations,
                post: postLocation,
                put: putLocation,
                delete: deleteLocation
            },
            mediaBank: {
                get: getImages,
                updload: updloadImage,
                delete: deleteImages
            }



        };
    }

})();
