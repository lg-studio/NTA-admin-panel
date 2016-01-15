(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('EpisodesController', EpisodesController)
        .controller('CreateEpisodeController', CreateEpisodeController)
        .controller('EditEpisodeController', EditEpisodeController);



    /** @ngInject */
    function EpisodesController(API_admin, $scope, $q, lodash, API_ROOT) {
        $scope.episodeImg = API_ROOT + "/v1/image/episode/"
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
            return loadEpisodes();
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
        function loadEpisodes() {
            return API_admin.episodes.get();
        }

        $scope.skip = function(dessert, index) {
            return index >= ($scope.query.limit * ($scope.query.page - 1));
        };

        $scope.deleteSelectedEpisodes = function() {
            var promises = [];

            lodash.forEach($scope.selected, function(item) {
                promises.push(API_admin.episodes.delete(item.id))
            })

            $q.all(promises).then(function() {
                $scope.episodes = lodash.difference($scope.episodes, $scope.selected);
                $scope.selected = [];
            });
        }

        loadEpisodes().then(function(res) {
            // .then(function(res) {
            $scope.episodes = res.data;
            console.log('Episodes: ', $scope.episodes);
            // }, function(err) {
            //     console.log('Get Courses error', err.data);
            // });
        });
    }

    function CreateEpisodeController($scope, Upload, API_admin, API_teacher, $timeout, lodash, $state, API_ROOT, MediabankUpload) {
        $scope.selectedScenes = [];
        $scope.newEpisode = {};
        $scope.imageLoadTypeText = 'Load from mediabank';
        // $scope.showMediaLibrary = false;

        API_admin.scenes.get().then(function(res) {
            $scope.scenes = res.data
        })

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
                            // 'episodeId': $scope.createdEpisode.id
                            'episodeId': itemId
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

        $scope.removeUploadedImage = function(){
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
                $scope.newEpisode.image && delete $scope.newEpisode.image;
            }

        }

        $scope.selectImageFromMediaLibrary = function(image) {
            $scope.newEpisode.image = image.id;
        }


        $scope.createEpisode = function() {
            $scope.newEpisode.scenes = lodash.map($scope.selectedScenes, function(e) {
                return e.id
            });

            API_admin.episodes.post($scope.newEpisode).then(function(res) {
                if($scope.filesToUpload && $scope.filesToUpload.length > 0) {
                    MediabankUpload.fileUploader($scope.filesToUpload[0], { episodeId: res.data.id})
                        .progress(function(evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
                        })
                        .success(function(data, status, headers, config) {
                            $scope.filesToUpload = [];
                            $scope.progressPercentage = 0;
                            $scope.createEpisodeForm.$setUntouched();
                            $state.go('main.episodes');
                        })
                        .error(function(err) {
                            console.log('e', err)
                        })
                } else $state.go('main.episodes');
            }, function(err) {
                console.log('Create episode error', err.data);
            })
        }
    }

    function EditEpisodeController($scope, API_ROOT, API_admin, API_teacher, $timeout, $state, $stateParams, lodash, Upload, MediabankUpload) {
        $scope.selectedScenes = [];
        $scope.episodeImg = API_ROOT + "/v1/image/episode/"
        $scope.imageLoadTypeText = 'Load from mediabank';

        API_admin.episodes.get($stateParams.id).then(function(res) {
            $scope.episode = res.data;
            console.log($scope.episode);
        })

        API_admin.scenes.get().then(function(res) {
            $scope.scenes = res.data

            API_teacher.scenes.get($stateParams.id).then(function(res) {
                $scope.currentScenes = res.data

                for (var i = 0; i < $scope.currentScenes.length; i++) {
                    for (var j = 0; j < $scope.scenes.length; j++) {
                        if ($scope.currentScenes[i].id == $scope.scenes[j].id) {
                            $scope.selectedScenes.push($scope.scenes[j]);
                        }
                    }
                }

            })


        })

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

        function fileUploader(file, fields) {
            if(file) {
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

        $scope.uploadFiles = function(files, itemId) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: API_ROOT + '/v1/mediabank',
                        fields: {
                            // episodeId: $stateParams.id
                            'episodeId': itemId
                        },
                        file: file
                    }).progress(function(evt) {
                        $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
                    }).success(function(data, status, headers, config) {
                        $scope.filesToUpload = [];
                        $scope.progressPercentage = 0;
                    });
                }
            }
        }

        $scope.removeUploadedImage = function(){
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


        $scope.editEpisode = function() {
            $scope.episode.scenes = lodash.map($scope.selectedScenes, function(e) {
                return e.id
            });

            if($scope.mediaLibImgId){
                $scope.episode.image = $scope.mediaLibImgId;
            }

            API_admin.episodes.put($stateParams.id, $scope.episode).then(function(res) {
                if($scope.filesToUpload && $scope.filesToUpload.length > 0) {
                    MediabankUpload.fileUploader($scope.filesToUpload[0], { episodeId: res.data.id})
                        .progress(function(evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
                        })
                        .success(function(data, status, headers, config) {
                            $scope.filesToUpload = [];
                            $scope.progressPercentage = 0;
                            $scope.editEpisodeForm.$setUntouched();
                            $state.go('main.episodes');
                        })
                        .error(function(err) {
                            console.log('e', err)
                        })
                } else $state.go('main.episodes');
            }, function(err) {
                $scope.error = err.data;
                console.log('Episode updade error', err.data);
            })

        }
    }

})();
