(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('LocationsController', LocationsController)
        .controller('CreateLocationController', CreateLocationController)
        .controller('EditLocationController', EditLocationController);

    /** @ngInject */
    function LocationsController(API_admin, $scope, $q, lodash, API_ROOT) {
        $scope.locationImg = API_ROOT + "/v1/image/location/"
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
            return loadLocation();
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
        function loadLocations() {
            return API_admin.locations.get();
        }

        $scope.skip = function(dessert, index) {
            return index >= ($scope.query.limit * ($scope.query.page - 1));
        };

        $scope.deleteSelectedLocations = function() {
            var promises = [];

            lodash.forEach($scope.selected, function(item) {
                promises.push(API_admin.locations.delete(item.id))
            })

            $q.all(promises).then(function() {
                $scope.locations = lodash.difference($scope.locations, $scope.selected);
                $scope.selected = [];
            });
        }

        loadLocations().then(function(res) {
            // .then(function(res) {
            $scope.locations = res.data;
            console.log('Locations: ', $scope.locations);
            // }, function(err) {
            //     console.log('Get Courses error', err.data);
            // });
        });
    }

    function CreateLocationController($scope, API_admin, Upload, $timeout, $state, API_ROOT, MediabankUpload, DEFAULT_LAT, DEFAULT_LON) {
        $scope.imageLoadTypeText = 'Load from mediabank';
        $scope.DEFAULT_LAT = DEFAULT_LAT;
        $scope.DEFAULT_LON = DEFAULT_LON;
        $scope.newLocation = {
            name: '',
            desc: '',
            lat: DEFAULT_LAT,
            lon: DEFAULT_LON
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

        $scope.removeUploadedImage = function() {
            $scope.filesToUpload = [];
            $scope.uploadedImageUrl = null;
        }

        //load from library
        $scope.imageUrlPattern = API_ROOT + '/v1/mediabank/';

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
                $scope.newLocation.image && delete $scope.newLocation.image;
            }

        }

        $scope.selectImageFromMediaLibrary = function(image) {
            $scope.newLocation.image = image.id;
        }

        //FOR GOOLE MAP
        var map;

        $scope.$on('mapInitialized', function(evt, evtMap) {
            map = evtMap;
        });

        $scope.placeMarker = function(e) {
            if ($scope.marker) {
                $scope.marker.setMap(null);
            }

            console.log('e.latLng', e.latLng)

            $scope.marker = new google.maps.Marker({
                position: e.latLng
            });

            $scope.marker.setMap(map);
            map.panTo(e.latLng);
            
            $scope.newLocation.lat = e.latLng.K;
            $scope.newLocation.lon = e.latLng.G;
        };


        $scope.createLocation = function() {
            API_admin.locations.post($scope.newLocation).then(function(res) {
                $scope.createdLocation = res.data;
                $scope.newLocation = null;

                console.log('Location created', res.data);

                if ($scope.filesToUpload && $scope.filesToUpload.length > 0) {
                    MediabankUpload.fileUploader($scope.filesToUpload[0], {
                            locationId: res.data.id
                        })
                        .progress(function(evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                                evt.config.file.name + '\n' + $scope.log;
                        })
                        .success(function(data, status, headers, config) {
                            $scope.filesToUpload = [];
                            $scope.progressPercentage = 0;
                            $scope.createLocationForm.$setUntouched();
                            $state.go('main.locations');
                        })
                        .error(function(err) {
                            console.log('e', err)
                        })
                } else {
                    $scope.createLocationForm.$setUntouched();
                    $scope.createdLocation = null;
                    $state.go('main.locations');
                }


            }, function(err) {
                $scope.error = err.data;
                console.log('Create Location error', err.data);
            })

        }

    }

    function EditLocationController($scope, API_admin, $stateParams, $state, $timeout, API_ROOT, MediabankUpload, DEFAULT_LAT, DEFAULT_LON) {
        $scope.locationImg = API_ROOT + "/v1/image/location/";
        $scope.imageLoadTypeText = 'Load from mediabank';
        $scope.DEFAULT_LAT = DEFAULT_LAT;
        $scope.DEFAULT_LON = DEFAULT_LON;

        API_admin.locations.get($stateParams.id).then(function(res) {
            $scope.location = res.data;
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

        $scope.removeUploadedImage = function() {
            $scope.filesToUpload = [];
            $scope.uploadedImageUrl = null;
        }

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

        //FOR GOOLE MAP
        var map;

        $scope.$on('mapInitialized', function(evt, evtMap) {
            map = evtMap;
        });

        $scope.placeMarker = function(e) {
            if ($scope.marker) {
                $scope.marker.setMap(null);
            }

            $scope.marker = new google.maps.Marker({
                position: e.latLng
            });

            $scope.marker.setMap(map);
            map.panTo(e.latLng);
            
            $scope.location.lat = e.latLng.K;
            $scope.location.lon = e.latLng.G;
        };

        $scope.editLocation = function() {
            if($scope.mediaLibImgId){
                $scope.location.image = $scope.mediaLibImgId;
            }

            API_admin.locations.put($stateParams.id, $scope.location).then(function(res) {
                $scope.updatedLocation = res.data;

                if ($scope.filesToUpload && $scope.filesToUpload.length > 0) {
                    MediabankUpload.fileUploader($scope.filesToUpload[0], {
                            locationId: res.data.id
                        })
                        .progress(function(evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                                evt.config.file.name + '\n' + $scope.log;
                        })
                        .success(function(data, status, headers, config) {
                            $scope.filesToUpload = [];
                            $scope.progressPercentage = 0;
                            $scope.editLocationForm.$setUntouched();
                            $state.go('main.locations');
                        })
                        .error(function(err) {
                            console.log('e', err)
                        })
                } else {
                    $scope.editLocationForm.$setUntouched();
                    $scope.updatedCharacter = null;
                    $state.go('main.locations');
                }

            }, function(err) {
                $scope.error = err.data;
                console.log('Create location error', err.data);
            })
        }
    }

})();
