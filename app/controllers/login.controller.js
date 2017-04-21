(function () {
    'use strict';

    angular
        .module('gApp.login')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$state', 'profileService', '$scope', '$auth', '$localStorage', '$stateParams'];

    function LoginController($state, profileService, $scope, $auth, $localStorage, $stateParams) {
        var vm = this;

        vm.email = "";
        vm.password = "";

        function getProfile() {
            return profileService.getProfile().then(function (response) {
                $localStorage.profileData = response.data;
                $state.go('home');
                return vm.profileData;
            });
        }

        vm.authenticate = function (provider) {
            $auth.authenticate(provider).then(authCompleted);
            function authCompleted(response) {
                console.log(response.data);
                if (typeof response.data === 'undefined' || response.data.error) {
                    console.log("Error");
                    return false;
                }
            }

            $localStorage.token = response.data.token;
        };

        vm.login = function () {
            var credentials = {
                email: vm.email,
                password: vm.password
            };

            $auth.login(credentials)
                .then(loginCompleted)
                .catch(loginFailed);

            function loginCompleted(response) {
                if (typeof response.data === 'undefined' || response.data.error) {
                    console.log("Failed !");
                    return false;
                }
                $localStorage.token = response.data.token;

                if (typeof $stateParams.backurl !== 'undefined' && $stateParams.backurl !== '') {
                    window.location.href = window.atob($stateParams.backurl);
                } else {
                    getProfile();
                }
            }

            function loginFailed() {
                console.log("Failed !");
                return false;
            }
        };

        vm.openHome = function(){
            $state.go('home');
        };

    }

})();