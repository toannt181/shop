(function () {
    'use strict';

    angular
        .module('gApp.services')
        .factory('bannerService', bannerService);

    bannerService.$inject = ['$http', 'env'];

    function bannerService($http, env) {
        return {
            getList: getList,
            getHomePage:getHomePage
        };

        function getList() {
            return $http.get(env.API_URL + '/v1/banners')
                .then(getListCompleted)
                .catch(getListFailed);

            function getListCompleted(response) {
                return response.data;
            }
            
            function getListFailed() {
                console.log(response.data);
            }
        }

        function getHomePage(){
            return $http.get(env.API_URL + '/v2/homepages')
                .then(getListCompleted)
                .catch(getListFailed);

            function getListCompleted(response) {
                return response.data;
            }

            function getListFailed() {
                console.log(response.data);
            }
        }
    }
})();