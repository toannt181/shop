(function () {
    'use strict';

    angular
        .module('gApp.forgotPassword')
        .controller('ForgotController', ForgotController);
    ForgotController.$inject = ['$state', '$scope', 'forgotService', '$localStorage'];

    function ForgotController($state, $scope, forgotService, $localStorage) {
        var vm = this;
        vm.message = "";
        vm.forgotData = [];
        vm.forgotPassword = function () {
            return forgotService.forgotPassword(this.email).then(function (response) {
                vm.forgotData = response.data;
                $localStorage.code = response.code;
                // if (vm.forgotData === 'success') {
                //     $state.go('login');
                // }
                return vm.forgotData;
            });
        };

        vm.confirm = function () {
            return forgotService.confirm(this.email,$localStorage.code,this.code).then(function (response) {
                vm.forgotData = response.data;
                return vm.forgotData;
            });
        };

        vm.openHome = function () {
            $state.go('home');
        };
        
        vm.openLogin = function(){
            $state.go('login');
        };

    }
})();