(function () {
    'use strict';

    angular
        .module('gApp.register')
        .controller('RegisterController', RegisterController);
        RegisterController.$inject = ['$state','$scope'];

    function RegisterController($state, $scope) {
        var vm = this;
    }
    
})();