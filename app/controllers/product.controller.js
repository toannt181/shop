(function () {
    'use strict';

    angular
        .module('gApp.category')
        .controller('ProductController', ProductController);
        ProductController.$inject = ['$state', '$location', '$localStorage', '$scope', 'productService', 'categoryService', 'cartService'];

    function ProductController($state, $location, $localStorage, $scope, productService, categoryService, cartService) {
        var vm = this;

        vm.paging = [];
        vm.brands = [];
        vm.category = [];
        vm.parents = [];
        vm.carts = [];
        vm.products = [];
        vm.subMenu = [];
        vm.busy = false;
        vm.hasData = true;
        vm.isSearch = false;
		vm.isAddingCart = false;
        vm.total = 0;
        vm.totalAmount = 0;
        vm.totalFee = 0;
        vm.pageCurrent = 0;

        vm.categoryId = (typeof $location.search().categoryId !== 'undefined' ?  $location.search().categoryId : '');
        vm.brandId = (typeof $location.search().brandId !== 'undefined' ?  $location.search().brandId : '');
        vm.keySearch = (typeof $location.search().name !== 'undefined' ?  $location.search().name : '');
        vm.sort = (typeof $location.search().sort !== 'undefined' ?  $location.search().sort : '');
        vm.limit = (typeof $location.search().limit !== 'undefined' ?  $location.search().limit : 12);
        vm.offset = (typeof $location.search().offset !== 'undefined' ?  $location.search().offset : 0);
        vm.ratePrice = (typeof $location.search().ratePrice !== 'undefined' ?  $location.search().ratePrice : '');
		
        getBrands(vm.categoryId);

        function getBrands(catId) {
            return categoryService.getBrands(catId).then(function(response) {
                vm.brands = response.data;
                return vm.brands;
            });
        }
		 
		if(vm.categoryId !== ''){
            getCategoryById(vm.categoryId);
        }

        function getCategoryById(catId) {
            return categoryService.getById(catId).then(function(response) {
                vm.category = response.data;
				var parentId = parseInt(vm.category.parent_id);
				var count = 0;
				vm.gettingParent = false;
				while(count < 10 && parentId != 'NaN' && parentId !== 0) {
					if(!vm.gettingParent) {
						vm.gettingParent = true;
						getCategoryParent(parentId);
					}
					count++;
				}
                return vm.category;
            });
        }
			
		function getCategoryParent(parentId) {
			return categoryService.getById(parentId).then(function(response) {
				vm.parents.push(response.data);
				parentId = response.data.parent_id;
				vm.gettingParent = false;
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
//Cart
        getCart();
        function getCart() {
            cartService.countItems().then(function (response) {
                vm.totalItem = Math.floor(response.data) === 0 ? -1 : Math.floor(response.data);
                if (vm.totalItem > 0) {
                    cartService.getCart(vm.voucherCode).then(function (response) {
                        vm.carts = response.data;
                        vm.totalAmount = response.total_amount;
                        vm.totalFee = response.total_fee;
                    });
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
                    $('#popupInfo .content').html('Đã thêm vào giỏ hàng thành công');
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

        vm.removeCart = function (cartid) {
            for (var i = 0; i < vm.carts.length; i++) {
                if (vm.carts[i].id == cartid && vm.carts[i].quantity > 1) {
                    vm.carts[i].quantity = vm.carts[i].quantity - 1;
                    vm.total = vm.total - vm.carts[i].price;
                    vm.totalItem = vm.totalItem - 1;
                    $localStorage.totalItem = vm.totalItem;

                    var item = {
                        product_id: vm.carts[i].product_id,
                        product_variant_id: (vm.carts[i].product_variant_id!==null ? vm.carts[i].product_variant_id : 0),
                        quantity: -1
                    };

                    return cartService.addProduct(item);

                }
            }
        };
		
//End Cart

        if (typeof $localStorage.subMenu == 'undefined') {
            getSubMenu();
        } else {
			var tmpSubMenu = $localStorage.subMenu;
			for(var i = 0; i < tmpSubMenu.length; i++){
				var tmpSub = tmpSubMenu[i];
				if(vm.categoryId == tmpSub.id) {
					vm.subMenu = tmpSubMenu[i];
				}
			}
		}

        function getSubMenu() {
            return categoryService.getAllCategories().then(function (response) {
                var tmpSubMenu = response.data;
                for(var i = 0; i < tmpSubMenu.length; i++){
					var tmpSub = tmpSubMenu[i];
					if(vm.categoryId == tmpSub.id) {
						vm.subMenu = tmpSub;
					}
                }
				$localStorage.subMenu = tmpSubMenu;
                return;
            });
        }

        vm.openDetail = function(productId){
            $state.go('productsDetail',{productId: productId});
        };

        vm.openCategory = function(catId){
            $state.go('products',{categoryId: catId});
        };

        vm.openHome = function(){
            $state.go('home');
        };

        vm.openPage = function(id){
			var offset = vm.limit * (id - 1);
            $state.go('products',{offset: offset});
        };

        vm.openBrand = function(brandId){
            $state.go('products',{brandId: brandId, offset:0});
        };
		
		vm.openRatePrice = function(ratePrice) {
			$state.go('products', {ratePrice: ratePrice, offset:0});
		};
		
		$scope.sort = function() {
			$state.go('products', {sort: vm.sort});
		};
		
		$scope.limit = function() {
			$state.go('products', {limit: vm.limit});
		};
		
    }
	
})();