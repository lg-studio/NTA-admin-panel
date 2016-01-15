(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('ScenesController', ScenesController)
        .controller('CreateSceneController', CreateSceneController)
        .controller('EditSceneController', EditSceneController);



    /** @ngInject */
    function ScenesController(API_admin, $scope, $q, lodash, API_ROOT, Upload) {
        $scope.sceneImg = API_ROOT + '/v1/image/scene/';
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
            return loadScenes();
        };

        $scope.removeFilter = function() {
            $scope.filter.show = false;
            $scope.query.filter = '';

            if ($scope.filter.form.$dirty) {
                $scope.filter.form.$setPristine();
            }
        };

        //Get cources
        function loadCourses() {
            return API_admin.scenes.get();
        }

        $scope.skip = function(dessert, index) {
            return index >= ($scope.query.limit * ($scope.query.page - 1));
        };

        $scope.deleteSelectedScenes = function() {
            var promises = [];

            lodash.forEach($scope.selected, function(item) {
                promises.push(API_admin.scenes.delete(item.id))
            })

            $q.all(promises).then(function() {
                $scope.scenes = lodash.difference($scope.scenes, $scope.selected);
                $scope.selected = [];
            });
        }

        loadCourses().then(function(res) {
            // .then(function(res) {
            $scope.scenes = res.data;
            console.log('Courses: ', $scope.scenes);
            // }, function(err) {
            //     console.log('Get Courses error', err.data);
            // });
        });
    }

    function CreateSceneController($scope, API_admin, API_teacher, $timeout, Upload, lodash, $state, API_ROOT, MediabankUpload) {
        $scope.locationImg = API_ROOT + '/v1/image/location/';
        $scope.newScene = {};
        $scope.imageLoadTypeText = 'Load from mediabank';

        $scope.loadLocations = function() {
            API_teacher.locations.get().then(function(res) {
                $scope.locations = res.data;
                console.log($scope.locations);
            }, function(err) {
                console.log('Get location error', err.data);
            });
        };



        // select Tasks from task-list
        API_admin.tasks.get().then(function(res) {
            $scope.tasks = res.data
            console.log($scope.tasks);
        }, function error(argument) {
            console.log("Get select photo error");
        })

        // select image from mediaBank
        // API_teacher.mediaBank.get().then(function(res) {
        //     $scope.images = res.data
        //     console.log($scope.images);
        // }, function error(argument) {
        //     console.log("Get select photo error");
        // })


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

        $scope.uploadFiles = function(files, itemId) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: API_ROOT + '/v1/mediabank',
                        fields: {
                            'sceneId': itemId || $scope.createdScene.id
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
        $scope.toggleImageLoadType = function() {
            $scope.showMediaLibrary = !$scope.showMediaLibrary;

            if ($scope.showMediaLibrary) {
                $scope.imageLoadTypeText = 'Upload new image'
                API_admin.mediaBank.get().then(function(res) {
                    $scope.mediaImages = res.data
                }, function(err) {
                    console.log('Get images error', err);
                });
            } else {
                $scope.imageLoadTypeText = 'Load from mediabank'
                $scope.mediaImages = null;
                $scope.newScene.image && delete $scope.newScene.image;
            }

        }

        $scope.selectImageFromMediaLibrary = function(image) {
            $scope.newScene.image = image.id;
        }

        $scope.removeUploadedImage = function() {
            $scope.filesToUpload = [];
            $scope.uploadedImageUrl = null;
        }

        function fileUploader(file, fields) {
            if (file) {
                return Upload.upload({
                    url: API_ROOT + '/v1/mediabank',
                    fields: fields,
                    file: file
                }).progress(function(evt) {
                    $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                        evt.config.file.name + '\n' + $scope.log;
                })
            }
        }

        $scope.createScene = function() {
            $scope.newScene.tasks = lodash.map($scope.selectedTasks, function(e) {
                return e.id
            });



            API_admin.scenes.post($scope.newScene).then(function(res) {
                if ($scope.filesToUpload && $scope.filesToUpload.length > 0) {
                    MediabankUpload.fileUploader($scope.filesToUpload[0], {
                            sceneId: res.data.id
                        })
                        .progress(function(evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                                evt.config.file.name + '\n' + $scope.log;
                        })
                        .success(function(data, status, headers, config) {
                            $scope.filesToUpload = [];
                            $scope.progressPercentage = 0;
                            $scope.createSceneForm.$setUntouched();
                            $state.go('main.scenes');
                        })
                        .error(function(err) {
                            console.log('e', err)
                        })
                } else $state.go('main.scenes');
            }, function(err) {
                $scope.error = err.data;
                // $timeout(function() {
                //     $scope.error = null
                // }, 2000);
                console.log('Create scene error', err.data);
            })
        }
    }

    function EditSceneController($scope, API_admin, API_teacher, $timeout, $stateParams, $state, lodash, API_ROOT, Upload, MediabankUpload) {
        $scope.sceneImg = API_ROOT + '/v1/image/scene/';
        $scope.locationImg = API_ROOT + '/v1/image/location/';
        $scope.imageLoadTypeText = 'Load from mediabank';

        API_admin.scenes.get($stateParams.id).then(function(res) {
            $scope.scene = res.data;
            API_teacher.locations.get().then(function(res) {
                $scope.locations = res.data;
                $scope.currentLocation = lodash.find($scope.locations, function(e) {
                    return e.name === $scope.scene.location.name;
                })
                console.log("current", $scope.currentLocation);
            }, function(err) {
                console.log('Get location error', err.data);
            });
        })

        API_admin.tasks.get().then(function(res) {
            $scope.tasks = res.data

            API_teacher.tasks.get($stateParams.id).then(function(res) {
                $scope.currentTasks = res.data

                for (var i = 0; i < $scope.currentTasks.length; i++) {
                    for (var j = 0; j < $scope.tasks.length; j++) {
                        if ($scope.currentTasks[i].id == $scope.tasks[j].id) {
                            $scope.selectedTasks.push($scope.tasks[j]);
                        }
                    }
                }

            })
        })

        $scope.loadLocations = function() {
            API_teacher.locations.get().then(function(res) {
                $scope.locations = res.data;
                console.log($scope.locations);
            }, function(err) {
                console.log('Get location error', err.data);
            });
        };



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


        $scope.uploadFiles = function(files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    var fields = {}
                    if ($stateParams.id) fields.sceneId = $stateParams.id;

                    Upload.upload({
                        url: API_ROOT + '/v1/mediabank',
                        fields: fields,
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

        $scope.removeUploadedImage = function() {
            $scope.filesToUpload = [];
            $scope.uploadedImageUrl = null;
        }

        //load from library
        $scope.imageUrlPattern = API_ROOT + '/v1/mediabank/';
        $scope.toggleImageLoadType = function() {
            $scope.showMediaLibrary = !$scope.showMediaLibrary;

            if ($scope.showMediaLibrary) {
                $scope.imageLoadTypeText = 'Upload new image'
                API_admin.mediaBank.get().then(function(res) {
                    $scope.mediaImages = res.data
                }, function(err) {
                    console.log('Get images error', err);
                });
            } else {
                $scope.imageLoadTypeText = 'Load from mediabank'
                $scope.mediaImages = null;
                $scope.mediaLibImgId = null;
            }

        }

        $scope.selectImageFromMediaLibrary = function(image) {
            $scope.mediaLibImgId = image.id;
        }

        $scope.selectedLocation;

        $scope.editScene = function() {
            $scope.scene.tasks = lodash.map($scope.selectedTasks, function(e) {
                return e.id
            });

            var updatedScene = {
                name: $scope.scene.name,
                desc: $scope.scene.desc,
                tasks: $scope.scene.tasks,
            }

            $scope.scene.image ? updatedScene.image = $scope.scene.image : '';
            $scope.scene.location.id ? updatedScene.location = $scope.scene.location.id : '';

            if ($scope.mediaLibImgId) {
                updatedScene.image = $scope.mediaLibImgId;
            }

            // if ($scope.selectedLocation) {
            //     updatedScene.location = $scope.selectedLocation.id
            // }


            API_admin.scenes.put($stateParams.id, updatedScene).then(function(res) {

                if ($scope.filesToUpload && $scope.filesToUpload.length > 0) {
                    MediabankUpload.fileUploader($scope.filesToUpload[0], {
                            sceneId: res.data.id
                        })
                        .progress(function(evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                                evt.config.file.name + '\n' + $scope.log;
                        })
                        .success(function(data, status, headers, config) {
                            $scope.filesToUpload = [];
                            $scope.progressPercentage = 0;
                            $scope.createSceneForm.$setUntouched();
                            $state.go('main.scenes');
                        })
                        .error(function(err) {
                            console.log('e', err)
                        })
                } else $state.go('main.scenes');

                // $scope.updatedScene = res.data;
                // if (!$scope.showMeadiaLibrary) {
                //     $scope.uploadFiles($scope.filesToUpload);
                // }
                // console.log($scope.updatedScene);
                // $timeout(function() {
                //     $scope.updatedScene = null
                //     $state.go('main.scenes');
                // }, 1500);


            }, function(err) {
                $scope.error = err.data;
                console.log('Scene updade error', err.data);
            })
        }
    }

})();
