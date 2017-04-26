(function () {
    'use strict';

    angular
        .module('gApp.register')
        .controller('RegisterController', RegisterController);
        RegisterController.$inject = ['$state','$scope','registerService'];

    function RegisterController($state, $scope, registerService) {
        var vm = this;
        vm.message = "";
        vm.accountData = [];

        vm.addAccount = function() {
            if(this.password == this.password_confirmation && this.checkbox === true){
                return registerService.addAccount(this.email, this.password, this.password_confirmation).then(function(response) {
                    vm.accountData = response.data;
                    if (vm.accountData === 'success'){
                        $state.go('login');
                    }
                    return vm.accountData;
                });
            }
        };


        vm.openHome = function(){
            $state.go('home');
        };
    }
})();