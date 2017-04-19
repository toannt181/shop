(function () {
    'use strict';

    angular
        .module('gApp.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['categoryService', 'homeService', '$localStorage', '$scope', '$state'];

    function HomeController(categoryService, homeService, $localStorage, $scope, $state) {
        var vm = this;

        vm.categories = [];
        vm.homeData = [];
        vm.productHome = '';
        vm.catId = '';
		
        getHomePage();
        
        if (typeof $localStorage.subMenu == 'undefined') {
			return categoryService.getAllCategories().then(function (response) {
                vm.categories = response.data;
            });
        } else {
			vm.categories = $localStorage.subMenu;
		}
		
        vm.addEmail = function(data) {
            return homeService.addEmail(data).then(function(response) {
                vm.emailData = response.data;
                return vm.emailData;
            });
        };

        vm.search = function(){
            $state.go('productsList',{name:vm.keySearch});
        };

        function getHomePage(){
            return homeService.getHomePage().then(function(response) {
                vm.homeData = response.data;
                return vm.homeData;
            });
        }

        vm.openCategory = function(catId){
            $state.go('products',{categoryId: catId});
        };
		
		$scope.showDeail = function(productHome, catId){
			vm.productHome = productHome;
			vm.catId = catId;
		};
    }
})();