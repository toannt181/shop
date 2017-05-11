(function () {
    'use strict';

    angular
        .module('gApp.services')
        .factory('forgotService', forgotService);

    forgotService.$inject = ['$http', 'env'];

    function forgotService($http, env) {
        return {
            forgotPassword:forgotPassword,
            confirm:confirm
        };

        function forgotPassword(email) {
            return $http.post(env.API_URL + '/v2/forgot', {
                    data: {
                        email: email
                    },
                })
                .then(forgotPasswordCompleted);
            function forgotPasswordCompleted(response) {
                return response.data;
            }
        }

        function confirm(email,confirm,code) {
            return $http.post(env.API_URL + '/v2/forgot', {
                    data: {
                        email: email,
                        confirm: confirm,
                        code: code
                    },
                })
                .then(confirmCompleted);
            function confirmCompleted(response) {
                return response.data;
            }
        }


    }
})();