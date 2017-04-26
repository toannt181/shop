(function () {
    'use strict';

    angular
        .module('gApp.services')
        .factory('registerService', registerService);

    registerService.$inject = ['$http', 'env'];

    function registerService($http, env) {
        return {
            addAccount:addAccount
        };

        function addAccount(email, password, password_confirmation) {
            return $http.post(env.API_URL + '/v2/register', {
                    data: {
                        email: email,
                        password: password,
                        password_confirmation: password_confirmation
                    },
                })
                .then(addAccountCompleted);
            function addAccountCompleted(response) {
                return response.data;
            }
        }


    }
})();