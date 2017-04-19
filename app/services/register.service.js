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

        function addAccount(email, password) {
            return $http.post(env.API_URL + '/v2/register', {
                    data: {
                        email: email,
                        pass: password
                    },
                })
                .then(getSupplierCompleted);
            function getSupplierCompleted(response) {
                return response.data;
            }
        }


    }
})();