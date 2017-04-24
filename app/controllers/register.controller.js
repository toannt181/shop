(function () {
    'use strict';

    angular
        .module('gApp.register')
        .controller('RegisterController', RegisterController);
        RegisterController.$inject = ['$state','$scope','registerService'];

    function RegisterController($state, $scope, registerService) {
        var vm = this;

        vm.addAccount = function() {
            if(this.password == this.passConfirm && this.checkbox === true){
                return registerService.addAccount(this.email, this.password).then(function(response) {
                    vm.accountData = response.data;
                    $state.go('login');
                    return vm.accountData;
                });
            }
        };

        vm.openHome = function(){
            $state.go('home');
        };
    }
})();