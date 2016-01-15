(function() {
  'use strict';

  angular
    .module('NTA.admin')
    .directive('ntaChat', ntaChat);

  function ntaChat() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/chat/chat.html',
      controller: ChatController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ChatController() {
      var vm = this;

      // "vm.creation" is avaible by directive option "bindToController: true"
    }
  }
})();