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
        vm.message = "";

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
                if (typeof response.data != 'undefined' && response.data.token) {
                    $localStorage.token = response.data.token;
                    getProfile();
                } else {
                    vm.message = response.data.error;
                }
            }

            function loginFailed() {
                vm.message = 'Lỗi kết nối với server, vui lòng thử lại.';
            }
        };

        vm.openHome = function () {
            $state.go('home');
        };
    }

})();