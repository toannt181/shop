(function () {
    'use strict';

    angular
        .module('gApp.productSearches')
        .controller('ProductSearchesController', ProductSearchesController);
        ProductSearchesController.$inject = ['$state', '$location', '$localStorage', '$scope', 'productService', 'cartService', 'categoryService'];

    function ProductSearchesController($state, $location, $localStorage, $scope, productService, cartService, categoryService) {
        var vm = this;

        vm.paging = [];
        vm.brands = [];
        vm.subMenu = [];
        vm.products = [];
        vm.hasData = true;
        vm.isSearch = false;
		vm.isAddingCart = false;
        vm.total = 0;
        vm.pageCurrent = 0;

        vm.categoryId = (typeof $location.search().categoryId !== 'undefined' ?  $location.search().categoryId : '');
        vm.brandId = (typeof $location.search().brandId !== 'undefined' ?  $location.search().brandId : '');

        vm.keySearch = (typeof $location.search().name !== 'undefined' ?  $location.search().name : '');
        vm.sort = (typeof $location.search().sort !== 'undefined' ?  $location.search().sort : '');
        vm.limit = (typeof $location.search().limit !== 'undefined' ?  $location.search().limit : 12);
        vm.offset = (typeof $location.search().offset !== 'undefined' ?  $location.search().offset : 0);
        vm.ratePrice = (typeof $location.search().ratePrice !== 'undefined' ?  $location.search().ratePrice : '');
		
        if (typeof $localStorage.subMenu == 'undefined') {
            return categoryService.getAllCategories().then(function (response) {
                vm.subMenu = response.data;
                return;
            });
        } else {
			vm.subMenu = $localStorage.subMenu;
		}
		
        getBrands();
        function getBrands() {
            return categoryService.getBrands().then(function(response) {
                vm.brands = response.data;
                return vm.brands;
            });
        }
		
        getProductsList();
        function getProductsList() {
            var params = [
                {name: 'category_id', value: vm.categoryId},
                {name: 'brand_id', value: vm.brandId},
                {name: 'rate_price', value: vm.ratePrice},
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
                vm.hasData = vm.products.length === 0 ? false : true;
                return vm.products;
            });
            productService.countProduct(params).then(function(response) {
                vm.total = Math.ceil(response.data / vm.limit);
				if(vm.total > 1) {
					vm.pageCurrent = vm.offset/vm.limit + 1;
					for (var i = 1; i <= vm.total; i++) {
						if((i < vm.pageCurrent + 3 && i > vm.pageCurrent - 3) || (vm.pageCurrent < 5 && i < 5) || vm.total < 5 || (vm.pageCurrent > vm.total - 5 && i > vm.total - 5)
						)
							vm.paging.push(i);
					}
				}
            });
        }

        vm.addProductToCart = function (product_id, variantId) {
            vm.isAddingCart = true;
            var item = {product_id: product_id, product_variant_id : variantId, quantity: 1};
			
			$('#popupInfo .content').html('Đang xử lý...');
			$('#popupInfo').modal({
				escapeClose: false,
				clickClose: false,
				showClose: false
			});
            return cartService.addProduct(item).then(function (response) {
                getCart();
                if (response === true) {
                    $('#popupInfo .content').html('Đã thêm vào giỏ hàng thành công abc');
                    vm.isAddingCart = false;
                } else {
                    if (response.error.code === 10) {
                        $('#popupInfo .content').html('Sản phẩm đã bị hủy hoặc không đủ hàng');
                    } else {
                        $('#popupInfo .content').html('Có lỗi trong quá trình ghi nhận đơn hàng, vui lòng thử lại sau');
                    }
                    vm.isAddingCart = false;
                }
				setTimeout(function () {
					$("#popupInfo a.close").click();
				}, 1500);
            }, function (response) {
                $('#popupInfo .content').html('Có lỗi trong quá trình ghi nhận đơn hàng, vui lòng thử lại sau');
				setTimeout(function () {
					$("#popupInfo a.close").click();
				}, 1500);
                vm.isAddingCart = false;
            });
        };
		
        vm.openDetail = function(productId){
            $state.go('productsDetail',{productId: productId});
        };

        vm.openHome = function(){
            $state.go('home');
        };

        vm.openPage = function(id){
			var offset = vm.limit * (id - 1);
            $state.go('productSearches',{offset: offset});
        };

        vm.openBrand = function(brandId){
            $state.go('productSearches',{brandId: brandId, offset:0});
        };

        vm.openCategory = function(categoryId){
            $state.go('productSearches',{categoryId: categoryId, offset:0});
        };
		
		vm.openRatePrice = function(ratePrice) {
			$state.go('productSearches', {ratePrice: ratePrice, offset:0});
		};
		
		$scope.limit = function() {
			$state.go('productSearches', {limit: vm.limit});
		};
		
    }
	
})();