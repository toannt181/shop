(function () {
    'use strict';

    angular
        .module('gApp.services')
        .factory('productService', productService);

    productService.$inject = ['$http', 'env'];

    function productService($http, env) {
        return {
            getListByCategoryId: getListByCategoryId,
            findById: findById,
            getList: getList,
            getListDeal: getListDeal
        };

        function getListByCategoryId(categoryId, offset, limit) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            limit = typeof limit !== 'undefined' ? limit : 15;
            return $http
                .get(env.API_URL + '/v1/products?category_id=' + categoryId + '&offset=' + offset + '&limit=' + limit)
                .then(getListByCategoryIdCompleted)
                .catch(getListByCategoryIdFailed);

            function getListByCategoryIdCompleted(response) {
                return response.data;
            }

            function getListByCategoryIdFailed(response) {
                console.log(response.data);
            }
        }

        function findById(productId) {
            return $http
                .get(env.API_URL + '/v1/products/' + productId)
                .then(findByIdCompleted)
                .catch(findByIdFailed);

            function findByIdCompleted(response) {
                return response.data;
            }

            function findByIdFailed() {
                console.log(response.data);
            }
        }

        function getList(params, offset, limit) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            limit = typeof limit !== 'undefined' ? limit : 15;
            var query = '';
            for (var i = 0; i < params.length; i++) {
                if (typeof params[i].name !== 'undefined' && typeof params[i].value !== 'undefined') {
                    query = query + "&" + params[i].name + "=" + params[i].value;
                }
            }
            return $http
                .get(env.API_URL + '/v1/products?offset=' + offset + '&limit=' + limit + query)
                .then(getListCompleted, getListFailed);

            function getListCompleted(response) {
                return response.data;
            }

            function getListFailed(response) {
                console.log(response.data);
            }
        }

        function getListDeal(params, offset, limit) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            limit = typeof limit !== 'undefined' ? limit : 15;
            var query = '';
            for (var i = 0; i < params.length; i++) {
                if (typeof params[i].name !== 'undefined' && typeof params[i].value !== 'undefined') {
                    query = query + "&" + params[i].name + "=" + params[i].value;
                }
            }
            return $http
                .get(env.API_URL + '/v1/products?offset=' + offset + '&limit=' + limit + query)
                .then(getListCompleted, getListFailed);

            function getListCompleted(response) {
                return response.data;
            }

            function getListFailed(response) {
                console.log(response.data);
            }
        }
    }
})();