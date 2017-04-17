(function () {
    'use strict';

    angular
        .module('gApp.login')
        .controller('LoginController', LoginController);
        LoginController.$inject = ['$state','$scope'];

    function LoginController($state, $scope) {
        var vm = this;

        vm.show = function(){
            console.log("Success!");
        };

    }

})();