(function () {
    'use strict';

    angular
        .module('gApp.services')
        .factory('profileService', profileService);

    profileService.$inject = ['$http', 'env'];

    function profileService($http, env) {
        return {
            getProfile:getProfile
        };

        function getProfile(){
            return $http.get(env.API_URL + '/v1/profile')
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