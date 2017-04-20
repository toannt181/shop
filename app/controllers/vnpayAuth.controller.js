(function () {
    'use strict';

    angular
        .module('gApp.vnpayAuth')
        .controller('VnpayAuthController', VnpayAuthController);

    VnpayAuthController.$inject = ['$auth', '$state', '$stateParams', '$localStorage', '$window'];

    function VnpayAuthController($auth, $state, $stateParams, $localStorage, $window) {
        var vm = this;

        var credentials = {
            data: encodeURIComponent($stateParams.data),
            signature: $stateParams.signature
        };
        
        // Use Satellizer's $auth service to login
        $auth.login(credentials)
             .then(authLoginCompleted)
             .catch(authLoginFailed);

        function authLoginCompleted(response) {
            if (response.data.error) {
                window.location.href = '/vnpayshop/backapp';
            }
            
            $localStorage.token = response.data.token;
            if(typeof $stateParams.backurl !== 'undefined' && $stateParams.backurl !== ''){
                window.location.href = window.atob($stateParams.backurl);
            }else{
                $state.go('home', {});
            }

        }

        function authLoginFailed(response) {
            $window.location.href = '/vnpayshop/backapp';
        }
    }
})();