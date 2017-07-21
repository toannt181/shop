(function () {
    'use strict';

    angular
        .module('gApp.register')
        .controller('RegisterController', RegisterController);
    RegisterController.$inject = ['$state', 'profileService', '$scope', '$auth', '$localStorage', 'registerService'];

    function RegisterController($state, profileService, $scope, $auth, $localStorage, registerService) {
        var vm = this;
        vm.message = "";
        vm.accountData = [];
        vm.isLoginMobile = false;
        vm.checkPassword = true;
        vm.equalPassword = true;

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

        vm.addAccount = function () {
            vm.message = "<br/>Vui lòng nhập đẩy đủ thông tin";
            if (this.checkbox === true) {
                if (this.email !== '' && this.email.length > 6) {
                    if (this.password !== '' && this.password.length > 6) {
                        if (this.password == this.repassword) {
                            vm.message = "";
                            vm.equalPassword = true;
                            return registerService.addAccount(this.email, this.password, this.repassword, this.phone, this.gender).then(function (response) {
                                vm.accountData = response.data;
                                if (vm.accountData === 'success') {
                                    $state.go('login');
                                } else {
                                    vm.message = '';
                                    for (var i = 0; i < vm.accountData.email.length; i++)
                                        vm.message += '</br>' + vm.accountData.email[i];
                                }
                            });
                        } else {
                            vm.equalPassword = false;
                        }
                        vm.checkPassword = true;
                    } else {
                        vm.checkPassword = false;
                    }
                }
            } else {
                vm.message = "<br/>Bạn phải đồng ý với các điều khoản của VNShop";
            }
        };

        vm.openHome = function () {
            $state.go('home');
        };

        vm.loginMobile = function () {
            vm.isLoginMobile = true;
        };
    }
})();