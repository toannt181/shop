(function () {
    'use strict';

    angular
        .module('gApp.shared')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$state', '$location', '$stateParams', '$localStorage', 'categoryService'];

    function HeaderController($state, $location, $stateParams, $localStorage, categoryService) {
        var vm = this;
		
		vm.subMenu = [];
        vm.listCategory = $localStorage.listCategory;
		vm.searchResult = [];
		vm.provinceId = $localStorage.provinceId;
        vm.categoryId = (typeof $location.search().categoryId !== 'undefined' ?  $location.search().categoryId : false);
        vm.profileData = $localStorage.profileData;
        vm.token = $localStorage.token;
        if(!vm.profileData || !$localStorage.token){
            // $localStorage.$reset();
            // $state.reload();
        }
        
		getSubMenu();
        function getSubMenu() {
            var param = {
                parent_id: 0
            };
            return categoryService.getAllCategories().then(function (response) {
                vm.subMenu = response.data;
                vm.listCategory = response.data;
                $localStorage.subMenu = vm.subMenu;
                $localStorage.listCategory = vm.listCategory;
                return;
            });
        }

        vm.gotoCatPage = function (catId, typeId) {
            if (typeof typeId !== 'undefined' && typeId != '0') {
				if (typeId == 1) {
					vm.categoryId = catId;
					if(typeof $localStorage.provinceId === 'undefined') {
						$('#popupProvince').modal({
							escapeClose: false,
							clickClose: false,
							showClose: false
						});
					} else {
						$state.go("deals", {categoryId: catId});
					}
				} else {
					$state.go("foods", {categoryId: catId});
                }
            } else {
                $state.go("productsList", {categoryId: catId});
            }
        };

        vm.getSearchResult = function () {
            if (vm.keySearch === '') {
                vm.searchResult = [];
                return false;
            }
            return categoryService.getSearchResult(vm.keySearch).then(function (response) {
                vm.searchResult = response.data;
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

        vm.goSubCat = function(i, cat){
            $localStorage.listCategory = vm.listCategory;
            if(cat.children.length===0){
                if (typeof cat.type !== 'undefined' && cat.type != '0') {
                    if (typeof $localStorage.provinceId === 'undefined') {
                        $state.go("provinces", {categoryId: cat.id, typeId: cat.type, name:''});
                    } else {
                        if(cat.type == 1) {
                            $state.go("deals", {categoryId: cat.id, name:''});
                        } else {
                            $state.go("suppliersList", {categoryId: cat.id, name:''});
                        }
                    }
                } else {
                    $state.go("productsList", {categoryId: cat.id, supplierId:0, name:''});
                }
                $localStorage.isShowMenu = false;
            } else {
                $localStorage.catParent = cat;
                vm.catParent = $localStorage.catParent;
                $localStorage.listCategory  = vm.listCategory[i].children;
                vm.listCategory = $localStorage.listCategory;
            }
        };
		
        vm.goState = function(state){
            $state.go(state);
        };

        vm.openDetail = function(productId){
            $state.go('productsDetail',{productId: productId});
        };

        vm.search = function(){
            $state.go('productSearches',{name: vm.keySearch});
        };

        vm.toggleSearch = function () {
            vm.isShowSearch = !vm.isShowSearch;
        };

        vm.openDeal = function () {
			$localStorage.provinceId = vm.provinceId;
			$state.go("deals", {categoryId: vm.categoryId});
        };

        vm.openLogout = function(){
            $localStorage.$reset();
            $state.reload();
            $state.go('home');
        };
    }

})();