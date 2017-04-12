(function () {
    'use strict';

    angular
        .module('gApp.core')
        .factory('cartService', cartService);

    cartService.$inject = ['$http', 'env'];

    function cartService($http, env) {

        return {
            getCart: getCart,
            updateCart: updateCart,
            addItem: addItem,
            addProduct:addProduct,
            countItems: countItems,
            updateVoucher:updateVoucher
        };

        function addItem(data) {

            return $http.post(env.API_URL + '/v1/carts/add', angular.toJson(data))
                .then(successCallback, errorCallback);

            function successCallback(response) {
                return true;
            }

            function errorCallback(response) {
                return response.error;
            }
        }


        function getCart(voucherCode) {
            if(typeof voucherCode === 'undefined'){
                voucherCode = '';
            }
            return $http.get(env.API_URL + "/v1/carts?voucher="+voucherCode)
                .then(getCartCompleted);

            function getCartCompleted(response) {
                return response.data;
            }
        }

        function updateCart(cart, voucherCode) {
            if(typeof voucherCode === 'undefined'){
                voucherCode = '';
            }
            var data = {data: cart, voucher: voucherCode};
            return $http.put(env.API_URL + '/v1/carts/update', angular.toJson(data))
                .then(successCallback, errorCallback);

            function successCallback(response) {
                return response.data;
            }

            function errorCallback(response) {
                return false;
            }

        }

        function addProduct(product){
            return $http.post(env.API_URL + '/v1/carts/add', angular.toJson(product))
                .then(successCallback, errorCallback)
                .catch(addProductFailed);

            function successCallback(response) {
                return true;
            }

            function errorCallback(response) {
                return response.data;
                //return false;
            }

            function addProductFailed(response) {
                console.log(response);
                return false;
            }
        }

        function countItems() {
            return $http.get(env.API_URL + '/v1/carts/items/count')
                .then(countItemsCompleted)
                .catch(countItemsFailed);

            function countItemsCompleted(response) {
                return response.data;
            }

            function countItemsFailed(response) {
                return 0;
            }
        }

        function updateVoucher(voucherCode){
            var data = {voucher: voucherCode};
            return $http.put(env.API_URL + '/v1/carts/voucher', angular.toJson(data))
                .then(successCallback, errorCallback);

            function successCallback(response) {
                return response.data;
            }

            function errorCallback(response) {
                return false;
            }
        }
    }
})();