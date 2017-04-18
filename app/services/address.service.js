/**
 * Created by tranlinh on 4/4/2016.
 */
(function () {
    'use strict';

    angular
        .module('gApp.core')
        .factory('addressService', addressService);

    addressService.$inject = ['$http', 'env'];

    function addressService($http, env) {

        return {
            getAddresses: getAddresses,
            getDefaultAddress:getDefaultAddress,
            setDefaultAddress:setDefaultAddress,
            getProvinces:getProvinces,
            addAddress:addAddress
        };

        function getAddresses() {
            return $http.get(env.API_URL + '/v1/addresses')
                .then(getAddressesCompleted);

            function getAddressesCompleted(response) {
                return response.data;
            }
        }

        function getDefaultAddress() {
            return $http.get(env.API_URL + '/v1/addresses/default')
                .then(getDefaultAddressCompleted);

            function getDefaultAddressCompleted(response) {
                return response.data;
            }
        }

        function setDefaultAddress(addressId) {
            return $http.put(env.API_URL + '/v1/addresses/set_default',{'id':addressId})
                .then(successCallback, errorCallback);

            function successCallback(response) {
                return true;
            }

            function errorCallback(response) {
                return response.error;
            }
        }

        function getProvinces(){
            return $http.get(env.API_URL + '/v1/districts')
                .then(getProvincesCompleted);

            function getProvincesCompleted(response) {
                return response.data;
            }
        }

        function addAddress(param) {
            return $http.post(env.API_URL + '/v1/addresses/add',param)
                .then(successCallback, errorCallback);

            function successCallback(response) {
                return true;
            }

            function errorCallback(response) {
                return response.error;
            }
        }
    }
})();