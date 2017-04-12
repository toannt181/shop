(function () {
    'use strict';

    angular
        .module('gApp.category')
        .controller('ProductController', ProductController);
        ProductController.$inject = ['$state', '$location', '$localStorage', '$scope', 'productService', 'categoryService', 'cartService'];

    function ProductController($state, $location, $localStorage, $scope, productService, categoryService, cartService) {
        var vm = this;

        vm.brands = [];
        vm.category = [];
        vm.carts = [];
        vm.products = [];
        vm.offset = 0;
        vm.busy = false;
        vm.hasData = true;
        vm.isSearch = false;

        vm.categoryId = (typeof $location.search().categoryId !== 'undefined' ?  $location.search().categoryId : '');
        vm.brandId = (typeof $location.search().brandId !== 'undefined' ?  $location.search().brandId : '');

        vm.keySearch = (typeof $location.search().name !== 'undefined' ?  $location.search().name : '');
        vm.sort = (typeof $location.search().sort !== 'undefined' ?  $location.search().sort : '');
        vm.limit = (typeof $location.search().limit !== 'undefined' ?  $location.search().limit : 12);

        
        getBrands(vm.categoryId);
        function getBrands(catId) {
            return categoryService.getBrands(catId).then(function(response) {
                vm.brands = response.data;
                return vm.brands;
            });
        }
		getCart();
        function getCart() {
            cartService.countItems().then(function (response) {
                vm.totalItem = Math.floor(response.data) === 0 ? -1 : Math.floor(response.data);
                if (vm.totalItem > 0) {
                    cartService.getCart(vm.voucherCode).then(function (response) {
                        vm.carts = response.data;
                    });
                }
            });
        }
		
		if(vm.categoryId !== ''){
            getCategoryById(vm.categoryId);
        }
        function getCategoryById(catId) {
            return categoryService.getById(catId).then(function(response) {
                vm.category = response.data;
                return vm.category;
            });
        }
		
        getProductsList();
        function getProductsList() {
            var params = [
                {name: 'category_id', value: vm.categoryId},
                {name: 'brand_id', value: vm.brandId},
                {name: 'query', value: vm.keySearch}
            ];

            if(vm.sort !== '' ){
				var tmp_sort = 'id', tmp_sortType = 'desc';
				if(vm.sort == 1) {
					tmp_sort = 'price';
					tmp_sortType = 'asc';
				} else if(vm.sort == 2) {
					tmp_sort = 'price';
					tmp_sortType = 'desc';
				}
                params.push({name: 'sort', value: tmp_sort});
                params.push({name: 'sort_type', value: tmp_sortType});
            }

            if(vm.keySearch !==''){
                vm.isSearch = true;
            }
            productService.getList(params, vm.offset, vm.limit).then(function(response) {
                vm.products = response.data;
                vm.offset = vm.products.length;
                vm.hasData = vm.products.length === 0 ? false : true;
                return vm.products;
            });
        }

        vm.openDetail = function(productId){
            $state.go('productsDetail',{productId: productId});
        };

        vm.openBrand = function(brandId){
            $state.go('products',{brandId: brandId});
        };
		
		$scope.sort = function() {
			$state.go('products', {sort: vm.sort});
		};
		
		$scope.limit = function() {
			$state.go('products', {limit: vm.limit});
		};
		
    }
	
})();