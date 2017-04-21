(function () {
    'use strict';
    angular
        .module('gApp.services')
        .factory('categoryService', categoryService);
    categoryService.$inject = ['$http', 'env'];
    function categoryService($http, env) {
        return {
            getList: getList,
            getById: getById,
            getAllCategories: getAllCategories,
            getSearchResult:getSearchResult,
            getBrands:getBrands,
            findProductById:findProductById
        };
        function getList(param) {
            return $http.get(env.API_URL + '/v2/categories?' + decodeURIComponent($.param(param)))
                .then(getListCompleted);
            function getListCompleted(response) {
                return response.data;
            }
        }
        function findProductById(productId) {
            return $http
                .get(env.API_URL + '/v2/products/' + productId)
                .then(findByIdCompleted)
                .catch(findByIdFailed);
            function findByIdCompleted(response) {
                return response.data;
            }
            function findByIdFailed() {
                console.log(response.data);
            }
        }
   
        function getBrands(id) { 
            return $http.get(env.API_URL + '/v2/categories/' + id +'/brands')
                .then(getListCompleted);
            function getListCompleted(response) {
                return response.data;
            }
        }
   
        function getAllBrands() { 
            return $http.get(env.API_URL + '/v2/brands')
                .then(getListCompleted);
            function getListCompleted(response) {
                return response.data;
            }
        }
        function getSearchResult(keyword) {
            return $http.get(env.API_URL + '/v2/search?keyword=' + keyword)
                .then(getListCompleted);
            function getListCompleted(response) {
                return response.data;
            }
        }
        function getById(id){
            return $http.get(env.API_URL + '/v2/categories/' + id)
                .then(getListCompleted);
            function getListCompleted(response) {
                return response.data;
            }
        }
        function getAllCategories(){
            return $http.get(env.API_URL + '/v2/categories/all')
                .then(getCategoriesCompleted);
            function getCategoriesCompleted(response) {
                return response.data;
            }
        }
    }
})();