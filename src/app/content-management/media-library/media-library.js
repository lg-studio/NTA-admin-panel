(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('MediaLibraryController', MediaLibraryController);
    //         .controller('CreateEpisodeController', CreateEpisodeController)
    //         .controller('CreateSceneController', CreateSceneController)
    //         .controller('CreateSemesterController', CreateSemesterController);



    //     /** @ngInject */
    function MediaLibraryController(API_ROOT, API_teacher, API_admin, $q, $scope, lodash, Upload, $timeout) {
        $scope.imageUrlPattern = API_ROOT + '/v1/mediabank/';
        $scope.selectedFiles = [];

        API_admin.mediaBank.get().then(function(res) {
            $scope.images = res.data
            console.log($scope.images);
        }, function(err) {
            console.log('Get imahges error', err);
        });

        $scope.$watch('filesToUpload', function() {
            // $scope.upload($scope.files);
            if ($scope.filesToUpload && $scope.filesToUpload[0]) {
                readImage($scope.filesToUpload[0])
            }


        });

        function readImage(file) {
            var reader = new FileReader();
            var image = new Image();

            reader.readAsDataURL(file);
            reader.onload = function(_file) {
                $scope.uploadedImageUrl = _file.target.result
            };

        }

        $scope.toggleFile = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item);
        };

        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.uploadFiles = function(files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: API_ROOT + '/v1/mediabank',
                        fields: {
                            // 'username': $scope.username
                        },
                        file: file
                    }).progress(function(evt) {
                        $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
                    }).success(function(data, status, headers, config) {
                        $scope.filesToUpload = [];
                        $scope.progressPercentage = 0;
                        $scope.uploadedImageUrl = null;
                        $scope.images.push(data);
                        // $timeout(function() {
                        //     $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                        // });
                    });
                }
            }
        }

        $scope.deleteSelectedFiles = function() {
            var promises = [];

            lodash.forEach($scope.selectedFiles, function(item) {
                promises.push(API_admin.mediaBank.delete(item.id))
            })

            $q.all(promises).then(function() {
                $scope.images = lodash.difference($scope.images, $scope.selectedFiles);
                $scope.selectedFiles = [];
            });
        }
    }

})();
