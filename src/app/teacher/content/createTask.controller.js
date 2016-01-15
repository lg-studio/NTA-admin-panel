/* global malarkey:false, toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('NTA.admin')
        // .constant('malarkey', malarkey)
        .controller('CreateTaskController', CreateTaskController)
        .controller('CreateCharacterController',CreateCharacterController)
        .controller('CreateLocationController', CreateLocationController)
        .directive('fileModel', fileModel)
        .directive('fileModel', fileModel);


    function CreateTaskController($scope, API_teacher, $mdDialog) {
        $scope.task = {};
        $scope.groups = null;
        $scope.characters = null;
        $scope.locations = null;
        $scope.semesters = null;
        $scope.episodes = null;
        $scope.scenes = null;
        $scope.selectedGroup = null;
        $scope.selectedSemester = null;
        $scope.selectedEpisode = null;
        $scope.selectedScene = null;

        $scope.selectGroup = function (group) {
            API_teacher.courses.get(group.id).then(function(res) {
                   $scope.semesters = res.data;
            },function (err) {
                    console.log('Get semester error', err.data);
            });

            API_teacher.students.get(group.id).then(function (res) {
                $scope.selectedGroup = group.name;
                $scope.students = res.data;
            }, function (err) {
                condole.log('Get students error', err.data);
            });
            
        };

        $scope.selectSemesters= function(semester){
            $scope.selectedSemester = semester.name;
            API_teacher.episodes.get(semester.id).then(function(res) {
                $scope.episodes = res.data;
            },function  (err) {
                console.log('Get semester error', err.data);
            });
        };

        $scope.selectEpisodes= function(episode){
            $scope.selectedEpisode = episode;
            API_teacher.scenes.get($scope.selectedEpisode.id).then(function(res) {
                $scope.scenes = res.data;
                console.log($scope.scenes);

            },function (err) {
                console.log('Get episode error', err.data);
            });
        };

        $scope.selectScene = function (scene) {
            $scope.selectedScene = scene.id;
        };

        API_teacher.classes.get().then(function(res) {
            $scope.groups = res.data;
        }, function(err) {
            console.log('Get groups error', err.data);
        });

        API_teacher.characters.get().then(function (res) {
            $scope.characters = res.data;
        }, function (err) {
            console.log('Get character error', err.data);
        });

        API_teacher.locations.get().then(function (res) {
            $scope.locations = res.data;
        }, function (err) {
            console.log('Get location error', err.data);
        });

        $scope.addLocation = function(location){
            $scope.task.location = location.id;
        };
         $scope.addCharacter = function(character){
            $scope.task.character = character.id;
        };

        $scope.showCreateCharacterModal = function($event) {
            $mdDialog.show({
                targetEvent: $event,
                templateUrl: 'app/teacher/content/createCharacter.modal.html',
                controller: 'CreateCharacterController',
                // scope: $scope,
                onComplete: afterShowAnimation,
            });
            
            //will be executed after modal appears
            function afterShowAnimation(scope, element, options) {
                // post-show code here: DOM element focus, etc.
            }
        };

        $scope.showCreateLocationModal = function($event) {
            $mdDialog.show({
                targetEvent: $event,
                templateUrl: 'app/teacher/content/createLocation.modal.html',
                controller: 'CreateLocationController',
                // scope: $scope,
                onComplete: afterShowAnimation,
            });
            
            //will be executed after modal appears
            function afterShowAnimation(scope, element, options) {
                // post-show code here: DOM element focus, etc.
            }
        };

        $scope.createTask = function () {
            API_teacher.tasks.create($scope.selectedScene, $scope.task).then(function (res) {
                console.log(res);
            });
            console.log($scope.task);
        };
    }

    function CreateCharacterController($scope, $mdDialog, API_teacher) {
        $scope.character = {
            name: "",
            desc: ""
        };
         $scope.createCharacter = function() {
            API_teacher.characters.create($scope.character.name, $scope.character.desc, $scope.character.image)
            .then(function (res) {
                console.log(res.data);
                $mdDialog.hide();
            }, function (err) {
                 console.log('Get character error', err.data);
            });
            
        };

        $scope.closeDialog = function() {
           $mdDialog.hide();
        };
    }




    function CreateLocationController($scope, $mdDialog, API_teacher) {
        $scope.location = {
            name:'',
            desc: ''
        };
         $scope.createLocation = function() {
            console.log($scope.location);
             API_teacher.locations.create($scope.location.name, $scope.location.desc, $scope.location.image, $scope.location.lon, $scope.location.lat)
            .then(function (res) {
                console.log(res.data);
                $mdDialog.hide();
            }, function (err) {
                 console.log('Get location error', err.data);
            });
        };

        $scope.closeDialog = function() {
            $mdDialog.hide();
        };

         //FOR GOOLE MAP
        var map;
        var marker;

        $scope.$on('mapInitialized', function(evt, evtMap) {
          map = evtMap;
          $scope.placeMarker = function(e) {
            if(marker) marker.setMap(null);
            marker = new google.maps.Marker({position: e.latLng});
            marker.setMap(map);
            map.panTo(e.latLng);
            $scope.location.lon = e.latLng.A;
            $scope.location.lat = e.latLng.F;
          };
        });

    }


    //FOR UPLOAD FILE
    function fileModel ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }

})();
