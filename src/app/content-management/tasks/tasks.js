(function() {
    'use strict';

    angular
        .module('NTA.admin')
        .controller('TasksController', TasksController)
        .controller('CreateTaskController', CreateTaskController)
        .controller('EditTaskController', EditTaskController);

    /** @ngInject */
    function TasksController(API_admin, $scope, $q, lodash, API_ROOT) {
        $scope.taskImg = API_ROOT + '/v1/image/task/';
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
            // return loadTasks();
        };

        $scope.removeFilter = function() {
            $scope.filter.show = false;
            $scope.query.filter = '';

            if ($scope.filter.form.$dirty) {
                $scope.filter.form.$setPristine();
            }
        };


        //Get cources
        function loadTasks() {
            return API_admin.tasks.get();
        }

        $scope.skip = function(dessert, index) {
            return index >= ($scope.query.limit * ($scope.query.page - 1));
        };

        $scope.deleteSelectedTasks = function() {
            var promises = [];

            lodash.forEach($scope.selected, function(item) {
                promises.push(API_admin.tasks.delete(item.id))
            })

            $q.all(promises).then(function() {
                $scope.tasks = lodash.difference($scope.tasks, $scope.selected);
                $scope.selected = [];
            });
        }

        loadTasks().then(function(res) {
            // .then(function(res) {
            $scope.tasks = res.data;
            console.log('tasks: ', $scope.tasks);
            // }, function(err) {
            //     console.log('Get Courses error', err.data);
            // });
        });
    }

    function CreateTaskController($scope, API_admin, API_teacher, Upload, $timeout, $compile, API_ROOT, $state, MediabankUpload) {
        $scope.newTask = {};
        $scope.task = {};
        $scope.task.chat = [];
        $scope.characterImg = API_ROOT + '/v1/image/character/';
        $scope.locationImg = API_ROOT + '/v1/image/location/';
        $scope.imageLoadTypeText = 'Load from mediabank';
        $scope.filesToUpload = [];

        $scope.loadCharacters = function() {
            API_teacher.characters.get().then(function(res) {
                $scope.characters = res.data;
            }, function(err) {
                console.log('Get character error', err.data);
            });
        };

        $scope.loadLocations = function() {
            API_teacher.locations.get().then(function(res) {
                $scope.locations = res.data;
                console.log($scope.locations);
            }, function(err) {
                console.log('Get location error', err.data);
            });
        };

        $scope.addDialog = function() {
            var _chat = {
                "_type": "TEXT",
                "text": "",
                "answers": ["", ""],
            };
            $scope.task.chat.push(_chat);
        };
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
                            'taskId': $scope.createdTask.id
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
                $scope.newTask.image && delete $scope.newTask.image;
            }

        }

        $scope.selectImageFromMediaLibrary = function(image) {
            $scope.newTask.image = image.id;
        }

        $scope.removeUploadedImage = function() {
            $scope.filesToUpload = [];
            $scope.uploadedImageUrl = null;
        }

        $scope.createTask = function() {
            $scope.newTask.chat = $scope.task.chat;
            $scope.mediaLibImgId ? $scope.newTask.image = $scope.mediaLibImgId : ''
            console.log($scope.newTask);
            API_admin.tasks.post($scope.newTask).then(function(res) {


                if ($scope.filesToUpload && $scope.filesToUpload.length > 0) {
                    MediabankUpload.fileUploader($scope.filesToUpload[0], {
                            taskId: res.data.id
                        })
                        .progress(function(evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                                evt.config.file.name + '\n' + $scope.log;
                        })
                        .success(function(data, status, headers, config) {
                            $scope.filesToUpload = [];
                            $scope.progressPercentage = 0;
                            $scope.createTaskForm.$setUntouched();
                            $state.go('main.tasks');
                        })
                        .error(function(err) {
                            console.log('e', err)
                        })
                } else $state.go('main.tasks');



                // if (!$scope.showMeadiaLibrary) {
                //     $scope.uploadFiles($scope.filesToUpload);
                // }

                // $scope.newTask = null;
                // $scope.createTaskForm.$setUntouched();

                // console.log('Task created', res.data);

                // $timeout(function() {
                //     $scope.createdTask = null;
                //     $state.go('main.tasks')
                // }, 2000);


            }, function(err) {
                $scope.error = err.data;
                console.log('Create task error', err.data);
            });
        };
    }

    function EditTaskController($scope, API_admin, API_teacher, $timeout, $stateParams, API_ROOT, Upload, $state, MediabankUpload, lodash) {
        $scope.taskImg = API_ROOT + '/v1/image/task/';
        $scope.currentImg = API_ROOT + '/v1/image/task/';
        $scope.characterImg = API_ROOT + '/v1/image/character/';
        $scope.locationImg = API_ROOT + '/v1/image/location/';
        $scope.task = {};
        $scope.task.chat = [];
        $scope.imageLoadTypeText = 'Load from mediabank';

        API_admin.tasks.get($stateParams.id).then(function(res) {
            $scope.task = res.data;

            API_teacher.characters.get().then(function(res) {
                $scope.characters = res.data;
                console.log($scope.characters);
                $scope.currentCharacter = lodash.find($scope.characters, function(e) {
                    return e.name === $scope.task.character.name;
                })
                console.log( "current" ,$scope.currentCharacter);
            }, function(err) {
                console.log('Get character error', err.data);
            });

            API_teacher.locations.get().then(function(res) {
                $scope.locations = res.data;
                 $scope.currentLocation = lodash.find($scope.locations, function(e) {
                    return e.name === $scope.task.location.name;
                })
                   console.log( "current" ,$scope.currentLocation);
            }, function(err) {
                console.log('Get location error', err.data);
            });

        });




        // $scope.addLocation = function(location) {
        //     console.log(location.id)
        //     $scope.task.location = location.id;
        // };

        // $scope.addCharacter = function(character) {
        //     $scope.task.character = character.id;
        // };

        $scope.addDialog = function() {
            var _chat = {
                "_type": "TEXT",
                "text": "",
                "answers": ["", ""],
            };
            $scope.task.chat.push(_chat);
        };

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
                            'taskId': $scope.task.id
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
                $scope.mediaLibImgId = null;
            }

        }

        $scope.selectImageFromMediaLibrary = function(image) {
            $scope.mediaLibImgId = image.id;
        }

        $scope.removeUploadedImage = function() {
            $scope.filesToUpload = [];
            $scope.uploadedImageUrl = null;
        }

        $scope.editTask = function() {
            if ($scope.mediaLibImgId) {
                $scope.task.image = $scope.mediaLibImgId;
            }

            // if ($scope.selectedLocation) {
            //     $scope.task.location = $scope.selectedLocation.id
            // }

            var updatedTask = {
                name: $scope.task.name,
                desc: $scope.task.desc,
                chat: $scope.task.chat,
                shortInfo: $scope.task.shortInfo,
                state: $scope.task.state
            }

            $scope.task.image ? updatedTask.image = $scope.task.image : '';
            $scope.task.location.id ? updatedTask.location = $scope.task.location.id: '';
            $scope.task.character.id ? updatedTask.character = $scope.task.character.id : '';

            API_admin.tasks.put($stateParams.id, updatedTask).then(function(res) {
                console.log(updatedTask);
                if ($scope.filesToUpload && $scope.filesToUpload.length > 0) {
                    MediabankUpload.fileUploader($scope.filesToUpload[0], {
                            taskId: res.data.id
                        })
                        .progress(function(evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            $scope.log = 'progress: ' + $scope.progressPercentage + '% ' +
                                evt.config.file.name + '\n' + $scope.log;
                        })
                        .success(function(data, status, headers, config) {
                            $scope.filesToUpload = [];
                            $scope.progressPercentage = 0;
                            $scope.createTaskForm.$setUntouched();
                            $state.go('main.tasks');
                        })
                        .error(function(err) {
                            console.log('e', err)
                        })
                } else $state.go('main.tasks');
            }, function(err) {
                $scope.error = err.data;
                console.log('Task updade error', err.data);
            });
        };
    }

})();
