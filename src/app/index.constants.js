/* global malarkey:false, toastr:false, moment:false */
(function() {
  'use strict';

  angular
    .module('NTA.admin')
    // .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('API_ROOT', 'https://ny-api.herokuapp.com') //https://ny-api.herokuapp.com  http://192.168.6.50:3000
    .constant('DEFAULT_LAT', -74.0063889)
    .constant('DEFAULT_LON', 40.7141667);

})();
