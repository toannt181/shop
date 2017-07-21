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
        vm.isLoginMobile = false;

        function getProfile() {
            return profileService.getProfile().then(function (response) {
                $localStorage.profileData = response.data;
                $state.go('home');
                return vm.profileData;
            });
        }

        vm.authenticate = function (provider) {
            $auth.authenticate(provider).then(authCompleted)
                .catch(loginFailed);

            function authCompleted(response) {
                console.log(response.data.token);
                if (typeof response.data.token === 'undefined' || !response.data.token) {
                    vm.message = "Lỗi đăng nhập";
                } else {
                    $localStorage.token = response.data.token;
                    getProfile();
                }
            }
            function loginFailed() {
                vm.message = 'Lỗi kết nối với server, vui lòng thử lại.';
            }
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

        vm.loginMobile = function () {
            vm.isLoginMobile = true;
        };

        vm.openHome = function () {
            $state.go('home');
        };

        vm.openForgotPassword = function () {
            $state.go('forgotPassword');
        };

        vm.openSignin = function () {
            $state.go('signin');
        };
    }

})();