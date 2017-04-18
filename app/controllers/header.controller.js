(function () {
    'use strict';

    angular
        .module('gApp.shared')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$state', '$location', '$stateParams', '$localStorage', 'categoryService'];

    function HeaderController($state, $location, $stateParams, $localStorage, categoryService) {
        var vm = this;
		
		vm.subMenu = [];
		vm.searchResult = [];
		vm.searched = false;
        vm.categoryId = (typeof $location.search().categoryId !== 'undefined' ?  $location.search().categoryId : false);
		
		getSubMenu();
        function getSubMenu() {
            return categoryService.getAllCategories().then(function (response) {
                vm.subMenu = response.data;
                $localStorage.subMenu = vm.subMenu;
				if(vm.categoryId) {
					vm.subMenu = [];
					for(var i = 0; i < $localStorage.subMenu.length; i++){
						var tmpSub = $localStorage.subMenu[i];
						if(vm.categoryId == tmpSub.id) {
							vm.subMenu = tmpSub.children;
							break;
						}
					}
                }
                return;
            });
        }
		
        vm.gotoCatPage = function (catId, typeId) {
            if (typeof typeId !== 'undefined' && typeId != '0') {
				if (typeof $localStorage.provinceId === 'undefined') {
					$state.go("provinces", {categoryId: catId, typeId: typeId});
				} else {
					if(typeId == 1) {
						$state.go("deals", {categoryId: catId});
					} else {
						$state.go("suppliers", {categoryId: catId});
					}
                }
            } else {
                $state.go("products", {categoryId: catId});
            }
        };

        vm.getSearchResult = function () {
            if (vm.keySearch === '') {
                vm.searchResult = [];
                vm.searched = false;
                return false;
            }
            return categoryService.getSearchResult(vm.keySearch).then(function (response) {
                vm.searchResult = response.data;
                vm.searched = true;
                var keepGoing = 0;
                vm.searchResultCatId = '';
                angular.forEach(vm.searchResult.categories.data, function (value) {
                    if (keepGoing <= 3) {
                        vm.searchResultCatId = vm.searchResultCatId + value.id;
                        keepGoing += keepGoing + 1;
                    }
                    if (keepGoing <= 3) {
                        vm.searchResultCatId = vm.searchResultCatId + ',';
                    }
                });
                return vm.searchResult;
            });
        };
		
        vm.openLogin = function(){
            $state.go('login');
        };

        vm.openRegister = function(){
            $state.go('register');
        };

        vm.openCart = function(){
            $state.go('cart');
        };

        vm.openDetail = function(productId){
            $state.go('productsDetail',{productId: productId});
        };

        vm.openCategory = function(catId){
            $state.go('products',{categoryId: catId});
        };

        vm.search = function(){
            $state.go('productSearches',{name: vm.keySearch});
        };

        vm.openHome = function(){
            $state.go('home');
        };

        vm.toggleSearch = function () {
            vm.isShowSearch = !vm.isShowSearch;
        };

    }

})();