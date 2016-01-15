(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('CharactersController', CharactersController)
        .controller('CreateCharacterController', CreateCharacterController)
        .controller('EditCharacterController', EditCharacterController);

    /** @ngInject */
    function CharactersController(API_admin, $scope, $q, lodash, API_ROOT) {
        $scope.characterImg = API_ROOT + "/v1/image/character/"
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
            return loadCharacter();
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
        function loadCharacters() {
            return API_admin.characters.get();
        }

        $scope.skip = function(dessert, index) {
            return index >= ($scope.query.limit * ($scope.query.page - 1));
        };

        $scope.deleteSelectedCharacters = function() {
            var promises = [];

            lodash.forEach($scope.selected, function(item) {
                promises.push(API_admin.characters.delete(item.id))
            })

            $q.all(promises).then(function() {
                $scope.characters = lodash.difference($scope.characters, $scope.selected);
                $scope.selected = [];
            });
        }

        loadCharacters().then(function(res) {
            // .then(function(res) {
            $scope.characters = res.data;
            console.log('Characters: ', $scope.characters);
            // }, function(err) {
            //     console.log('Get Courses error', err.data);
            // });
        });
    }

    function CreateCharacterController($scope, API_admin, Upload, $timeout, API_ROOT, $state, MediabankUpload) {
        $scope.newCharacter = {};
        $scope.imageLoadTypeText = 'Load from mediabank';

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
                            'characterId': $scope.createdCharacter.id
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
                        // $timeout(function() {
                        //     $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                        // });
                    });
                }
            }
        }

        //load from library
        $scope.imageUrlPattern = API_ROOT + '/v1/mediabank/';
        $scope.removeUploadedImage = function(){
            $scope.filesToUpload = [];
            $scope.uploadedImageUrl = null;
        }

        $scope.toggleImageLoadType = function() {
            $scope.showMediaLibrary = !$scope.showMediaLibrary;

            if ($scope.showMediaLibrary) {
                $scope.imageLoadTypeText = 'Upload new image'
                $scope.removeUploadedImage();
                API_admin.mediaBank.get().then(function(res) {
                    $scope.mediaImages = res.data
                }, function(err) {
                    console.log('Get images error', err);
                });
            } else {
                $scope.imageLoadTypeText = 'Load from mediabank'
                $scope.mediaImages = null;
                $scope.newCharacter.image && delete $scope.newCharacter.image;
            }

        }

        $scope.selectImageFromMediaLibrary = function(image) {
            $scope.newCharacter.image = image.id;
        }



        $scope.createCharacter = function() {

            API_admin.characters.post($scope.newCharacter).then(function(res) {
                $scope.createdCharacter = res.data;
                $scope.newCharacter = null;

                if($scope.filesToUpload && $scope.filesToUpload.length > 0) {
                    MediabankUpload.fileUploader($scope.filesToUpload[0], { characterId: res.data.id})
                        .progress(function(evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
                        })
                        .success(function(data, status, headers, config) {
                            $scope.filesToUpload = [];
                            $scope.progressPercentage = 0;
                            $scope.createCharacterForm.$setUntouched();
                            $state.go('main.characters');
                        })
                        .error(function(err) {
                            console.log('e', err)
                        })
                } else {
                    $scope.createCharacterForm.$setUntouched();
                    $scope.createdCharacter = null;
                    $state.go('main.characters');
                } 

            }, function(err) {
                $scope.error = err.data;
                $timeout(function() {
                    $scope.error = null
                }, 2000);
                console.log('Create Character error', err.data);
            })
        }
    }

    function EditCharacterController($scope, API_admin, Upload, $stateParams, $state, $timeout, API_ROOT, MediabankUpload) {
        $scope.characterImg = API_ROOT + "/v1/image/character/"
        $scope.imageLoadTypeText = 'Load from mediabank';

        API_admin.characters.get($stateParams.id).then(function(res) {
            $scope.character = res.data;
        });

        $scope.$watch('filesToUpload', function() {
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
                            'characterId': $scope.updatedCharacter.id
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
                        // $timeout(function() {
                        //     $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                        // });
                    });
                }
            }
        }

        //load from library
        $scope.imageUrlPattern = API_ROOT + '/v1/mediabank/';

        $scope.removeUploadedImage = function(){
            $scope.filesToUpload = [];
            $scope.uploadedImageUrl = null;
        }
        
        $scope.toggleImageLoadType = function() {
            $scope.showMediaLibrary = !$scope.showMediaLibrary;

            if ($scope.showMediaLibrary) {
                $scope.imageLoadTypeText = 'Upload new image';
                $scope.removeUploadedImage();
                API_admin.mediaBank.get().then(function(res) {
                    $scope.mediaImages = res.data
                }, function(err) {
                    console.log('Get images error', err);
                });
            } else {
                $scope.imageLoadTypeText = 'Load from mediabank';
                $scope.mediaImages = null;
                $scope.mediaLibImgId = null;
            }

        }

        $scope.selectImageFromMediaLibrary = function(image) {
            $scope.mediaLibImgId = image.id;
        }


        $scope.editCharacter = function() {
            if($scope.mediaLibImgId){
                $scope.character.image = $scope.mediaLibImgId;
            }

            API_admin.characters.put($stateParams.id, $scope.character).then(function(res) {
                $scope.updatedCharacter = res.data;

                if($scope.filesToUpload && $scope.filesToUpload.length > 0) {
                    MediabankUpload.fileUploader($scope.filesToUpload[0], { characterId: res.data.id})
                        .progress(function(evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
                        })
                        .success(function(data, status, headers, config) {
                            $scope.filesToUpload = [];
                            $scope.progressPercentage = 0;
                            $scope.editCharacterForm.$setUntouched();
                            $state.go('main.characters');
                        })
                        .error(function(err) {
                            console.log('e', err)
                        })
                } else {
                    $scope.editCharacterForm.$setUntouched();
                    $scope.updatedCharacter = null;
                    $state.go('main.characters');
                } 

            }, function(err) {
                $scope.error = err.data;
                console.log('Edit character error', err.data);
            })
        }
    }

})();
