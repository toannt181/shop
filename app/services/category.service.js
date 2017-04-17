(function () {
    'use strict';

    angular
        .module('gApp.services')
        .factory('categoryService', categoryService);

    categoryService.$inject = ['$http', 'env'];

    function categoryService($http, env) {
        return {
            getList: getList,
            
        };

        function getList(param) {
            return $http.get(env.API_URL + '/v2/categories?' + decodeURIComponent($.param(param)))
                .then(getListCompleted);

            function getListCompleted(response) {
                return response.data;
            }
        }


    }
})();