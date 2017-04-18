(function () {
    'use strict';

    angular
        .module('gApp.services')
        .factory('homeService', homeService);

    homeService.$inject = ['$http', 'env'];

    function homeService($http, env) {
        return {
            getHomePage:getHomePage,
            addEmail:addEmail
        };

        function getHomePage(){
            return $http.get(env.API_URL + '/v2/homepagesweb')
                .then(getListCompleted)
                .catch(getListFailed);

            function getListCompleted(response) {
                return response.data;
            }

            function getListFailed() {
                console.log(response.data);
            }
        }


        function addEmail(data) {
            return $http.post(env.API_URL + '/v2/follow', {
                    data: {
                        email: data,
                    },
                })
                .then(getSupplierCompleted);

            function getSupplierCompleted(response) {
                return response.data;
            }
        }


    }
})();