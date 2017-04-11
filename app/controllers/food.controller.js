(function () {
    'use strict';

    angular
        .module('gApp.food')
        .controller('FoodController', FoodController);
        FoodController.$inject = ['$state','$scope'];

    function FoodController($state, $scope) {
        var vm = this;
		
    }
	
})();