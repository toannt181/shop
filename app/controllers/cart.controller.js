(function () {
    'use strict';

    angular
        .module('gApp.cart')
        .controller('CartController', CartController);
        CartController.$inject = ['$state','$scope'];

    function CartController($state, $scope) {
        var vm = this;

        vm.show = function(){
            console.log("Success!");
        };

    }
    
})();