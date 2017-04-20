(function () {
    'use strict';

    angular
        .module('gApp.category')
        .controller('DealController', DealController);
        DealController.$inject = ['$state', '$location', '$localStorage', '$scope', 'productService', 'categoryService', 'cartService'];

    function DealController($state, $location, $localStorage, $scope, productService, categoryService, cartService) {
        var vm = this;

        vm.paging = [];
        vm.brands = [];
        vm.category = [];
        vm.parents = [];
        vm.carts = [];
        vm.products = [];
        vm.subMenu = [];
        vm.hasData = true;
		vm.isAddingCart = false;
        vm.totalPage = 0;
        vm.pageCurrent = 0;
        vm.msgPopup = '';

        vm.categoryId = (typeof $location.search().categoryId !== 'undefined' ?  $location.search().categoryId : '');
        vm.brandId = (typeof $location.search().brandId !== 'undefined' ?  $location.search().brandId : '');
        vm.keySearch = (typeof $location.search().name !== 'undefined' ?  $location.search().name : '');
        vm.sort = (typeof $location.search().sort !== 'undefined' ?  $location.search().sort : '');
        vm.limit = (typeof $location.search().limit !== 'undefined' ?  $location.search().limit : 12);
        vm.offset = (typeof $location.search().offset !== 'undefined' ?  $location.search().offset : 0);
        vm.ratePrice = (typeof $location.search().ratePrice !== 'undefined' ?  $location.search().ratePrice : '');
        vm.provinceId = (typeof $localStorage.provinceId !== 'undefined' ?  $localStorage.provinceId : false);
		
		if(!vm.provinceId || vm.categoryId === '') {
			$state.go('home');
		}
		 
		if(vm.categoryId !== ''){
            getCategoryById(vm.categoryId);
        }

        function getCategoryById(catId) {
            return categoryService.getById(catId).then(function(response) {
                vm.category = response.data;
				
				if(vm.category.type != '1') {
					if(vm.category.type == '2') {
						$state.go('foods', {categoryId: vm.categoryId});
					}
					$state.go('products', {categoryId: vm.categoryId});
				} else {
					getProductsList();
					getBrands(vm.categoryId);

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
				}
				
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
		
        function getBrands(catId) {
            return categoryService.getBrands(catId).then(function(response) {
                vm.brands = response.data;
                return vm.brands;
            });
        }
			
		function getCategoryParent(parentId) {
			return categoryService.getById(parentId).then(function(response) {
				vm.parents.push(response.data);
				parentId = response.data.parent_id;
				vm.gettingParent = false;
			});
		}
		
        function getProductsList() {
            var params = [
                {name: 'category_id', value: vm.categoryId},
                {name: 'province_id', value: vm.provinceId},
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
			
            productService.getList(params, vm.offset, vm.limit).then(function(response) {
                vm.products = response.data;
                vm.hasData = vm.products.length === 0 ? false : true;
                return vm.products;
            });
            productService.countProduct(params).then(function(response) {
                vm.totalPage = Math.ceil(response.data / vm.limit);
				if(vm.totalPage > 1) {
					vm.pageCurrent = vm.offset/vm.limit + 1;
					for (var i = 1; i <= vm.totalPage; i++) {
						if((i < vm.pageCurrent + 3 && i > vm.pageCurrent - 3) || (vm.pageCurrent < 5 && i < 5) || vm.totalPage < 5 || (vm.pageCurrent > vm.totalPage - 5 && i > vm.totalPage - 5)
						)
							vm.paging.push(i);
					}
				}
            });
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

        vm.addProductToCart = function (product_id, variantId) {
            vm.isAddingCart = true;
            var item = {product_id: product_id, product_variant_id : variantId, quantity: 1};
			vm.msgPopup = 'Đang xử lý...';
			$('#popupInfo').modal({
				escapeClose: false,
				clickClose: false,
				showClose: false
			});
            return cartService.addProduct(item).then(function (response) {
                if (response === true) {
                    vm.msgPopup = 'Đã thêm vào giỏ hàng thành công';
                    vm.isAddingCart = false;
                } else {
                    if (response.error.code === 10) {
                        vm.msgPopup = 'Sản phẩm đã bị hủy hoặc không đủ hàng';
                    } else {
                        vm.msgPopup = 'Có lỗi trong quá trình ghi nhận đơn hàng, vui lòng thử lại sau';
                    }
                    vm.isAddingCart = false;
                }
				setTimeout(function () {
					$("#popupInfo a.close").click();
				}, 1500);
            }, function (response) {
                vm.msgPopup = 'Có lỗi trong quá trình ghi nhận đơn hàng, vui lòng thử lại sau';
				setTimeout(function () {
					$("#popupInfo a.close").click();
				}, 1500);
                vm.isAddingCart = false;
            });
        };

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
            $state.go('deals',{offset: offset});
        };

        vm.openBrand = function(brandId){
            $state.go('deals',{brandId: brandId, offset:0});
        };
		
		vm.openRatePrice = function(ratePrice) {
			$state.go('deals', {ratePrice: ratePrice, offset:0});
		};
		
		$scope.sort = function() {
			$state.go('deals', {sort: vm.sort});
		};
		
		$scope.limit = function() {
			$state.go('deals', {limit: vm.limit});
		};

        vm.openOtherDeal = function (provinceId) {
			$localStorage.provinceId = provinceId;
			$state.reload();
        };
		
    }
	
})();