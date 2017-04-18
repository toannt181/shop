(function () {
    'use strict';

    angular
            .module('gApp.core')
            .factory('orderService', orderService);

    orderService.$inject = ['$http', 'env'];

    function orderService($http, env) {

        return {
            getList: getList,
            getItemByOrderId: getItemByOrderId,
            create: create,
            getById: getById
        };

        function getItemByOrderId(orderId) {
            return $http.get(env.API_URL + "/v1/orders/" + orderId)
                    .then(getCartCompleted);

            function getCartCompleted(response) {
                return response.data;
            }
        }
        
        function getList(type, offset, limit) {
            offset = typeof offset !== 'undefined' ?  offset : 0;
            limit = typeof limit !== 'undefined' ?  limit : 15;
            var query = 'offset=' + offset + '&limit=' + limit;
            switch (type) {
                case 'unpaid':
                    query = query + "&payment_status=0";
                    break;
                case 'paid':
                    query = query + "&payment_status=1";
                    break;
                case 'shipping':
                    query = query + "&shipping_status=4";
                    break;
                case 'cancel':
                    query = query + "&status=7";
                    break;
                default:
                    return false;
            }

            return $http.get(env.API_URL + "/v1/orders?" + query)
                        .then(successCallback)
                        .catch(errorCallback);

            function successCallback(response) {
                return response.data;
            }

            function errorCallback(response) {
                //
            }
        }

        function create(order) {
            return $http.post(env.API_URL + '/v1/orders/add', angular.toJson(order))
                    .then(successCallback, errorCallback);

            function successCallback(response) {
                return response.data;
            }

            function errorCallback(response) {
                return response.data;
            }
        }

        function getById(orderId) {
            return $http.get(env.API_URL + "/v1/orders/" + orderId)
                    .then(getOrderCompleted);

            function getOrderCompleted(response) {
                return response.data;
            }
        }
    }
})();