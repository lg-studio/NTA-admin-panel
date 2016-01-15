(function() {
    'use strict';
    angular.module('NTA.MediabankUpload', [])
    .factory('MediabankUpload', mediabankUpload);

    function mediabankUpload($localStorage, $injector, API_ROOT, Upload) {
        function fileUploader(file, fields) {
            console.log(file)
            if(file) {
                return Upload.upload({
                    url: API_ROOT + '/v1/mediabank',
                    fields: fields,
                    file: file
                })
            }
        }


        return {
            fileUploader: fileUploader
        };

    }

})();
