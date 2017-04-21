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
            getSubMenu();
        } else {
			vm.categories = $localStorage.subMenu;
		}

        function getSubMenu() {
            return categoryService.getAllCategories().then(function (response) {
                vm.categories = response.data;
				$localStorage.subMenu = vm.categories;
                return;
            });
        }
		
        vm.addEmail = function(data) {
            return homeService.addEmail(data).then(function(response) {
                vm.emailData = response.data;
                return vm.emailData;
            });
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
		
		$scope.showDeail = function(productId){
			vm.productHome = productId;
		};
    }
})();