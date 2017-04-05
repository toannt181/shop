(function () {
    'use strict';

    angular
        .module('gApp.shared')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$state','$location', '$stateParams', '$localStorage'];

    function HeaderController($state, $location, $stateParams, $localStorage) {
        var vm = this;

        vm.keySearch = '';
        vm.product = {};
        vm.catIdBaseOnProduct = '';
        vm.menuExisting = $localStorage.menuExisting;
        vm.categoryId = (typeof $location.search().categoryId !== 'undefined' ?  $location.search().categoryId : '');
        vm.subMenu = $localStorage.subMenu;
        vm.isShowMenu = $localStorage.isShowMenu == 2 ? 2 : false;
        vm.isToggleMenu = false;
        vm.isShowSearch = false;
        vm.searchResult = [];

        vm.searched = '';

        if (vm.keySearch === '') {
            vm.searched = false;
        }

        if (typeof $localStorage.subMenu == 'undefined') {
            // getSubMenu();
        }

        vm.search = function () {
            $state.go('productsList', {name: vm.keySearch});
        };

        vm.resetInput = function () {
            vm.searched = false;
            vm.keySearch = '';
        };

        vm.goProductDetail = function (productId) {
            $state.go('productsDetail', {productId: productId});
        };


        if(typeof $stateParams.productId !== 'undefined'){
            getCatBaseOnProductId($stateParams.productId);
        }

        function getCatBaseOnProductId(productId ){
            return categoryService.findProductById(productId).then(function(response) {
                vm.product = response.data;
                vm.catIdBaseOnProduct = vm.product.category.id;

                var count = vm.subMenu.length;
                for(var i=0; i < count ;i++){
                    for(var j=0;j<vm.subMenu[i].children.length;j++){
                        if(vm.subMenu[i].children[j].id == vm.catIdBaseOnProduct){
                            vm.subMenu[i].isOpen = true;
                        }
                    }
                }
                return vm.product;
            });
        }

        vm.getSearchResult = function(){
            if(vm.keySearch === ''){
                vm.searchResult = [];
                vm.searched = false;
                return false;
            }
            return categoryService.getSearchResult(vm.keySearch).then(function (response) {
                vm.searchResult = response.data;
                vm.searched = true;
                var keepGoing = 0;
                vm.searchResultCatId = '';
                angular.forEach(vm.searchResult.categories.data, function(value) {
                    if(keepGoing <= 3){
                        vm.searchResultCatId = vm.searchResultCatId + value.id ;
                        keepGoing += keepGoing + 1;
                    }
                    if(keepGoing <= 3){
                        vm.searchResultCatId = vm.searchResultCatId + ',';
                    }
                });
                return vm.searchResult;
            });
        };

        function getSubMenu() {
            var param = {
                parent_id: 0
            };
            return categoryService.getAllCategories().then(function (response) {
                vm.subMenu = response.data;
                for(var i=0;i<vm.subMenu.length;i++){
                    vm.subMenu[i].isOpen=false;
                }
                $localStorage.subMenu = vm.subMenu;
                return;
            });
        }

        vm.getCategories = function (catId) {
            vm.categories = [];
            var param = {
                parent_id: catId
            };
            return categoryService.getList(param).then(function (response) {
                vm.categories = response.data;
                return vm.categories;
            });
        };

        vm.getMenuExisting = function (id) {
            vm.menuExisting = id;
            $localStorage.menuExisting = vm.menuExisting;
            return;
        };

        vm.toggleSubmenu = function () {
            vm.isToggleMenu = (vm.isShowMenu == 2 && !vm.isToggleMenu) ? false : !vm.isToggleMenu;
            vm.isShowMenu = vm.isToggleMenu ? 2 : false;
            $localStorage.isShowMenu = vm.isShowMenu;
        };

        vm.showMenuExisting = function () {
            console.log(vm.menuExisting);
        };

        vm.activeClass = function (e) {
            console.log(e);
            e.classList.toggle("active");
            e.nextElementSibling.classList.toggle("show");
        };

        vm.gotoCatPage = function (catId, typeId) {
            $localStorage.subMenu = vm.subMenu;
            if (typeof typeId !== 'undefined' && typeId != '0') {
				$localStorage.isShowMenu = false;
				if (typeof $localStorage.provinceId === 'undefined') {
					$state.go("provinces", {categoryId: catId, typeId: typeId});
				} else {
					if(typeId == 1) {
						$state.go("productsDeal", {categoryId: catId});
					} else {
						$state.go("suppliersList", {categoryId: catId});
					}
                }
            } else {
                $state.go("productsList", {categoryId: catId, supplierId:0});
            }
        };

        vm.gotoSubCatPage = function (catId, typeId) {
            $localStorage.isShowMenu = false;
            if (typeof typeId !== 'undefined' && typeId != '0') {
				if (typeof $localStorage.provinceId === 'undefined') {
					$state.go("provinces", {categoryId: catId, typeId: typeId});
				} else {
					if(typeId == 1) {
						$state.go("productsDeal", {categoryId: catId});
					} else {
						$state.go("productsList", {categoryId: catId, supplierId:0});
					}
                }
            } else {
                $state.go("productsList", {categoryId: catId, supplierId:0});
            }
        };

        vm.toggleSearch = function () {
            vm.isShowSearch = !vm.isShowSearch;
        };

    }

})();