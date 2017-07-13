(function () {
    'use strict';

    angular
        .module('gApp.category')
        .controller('FoodController', FoodController);
        FoodController.$inject = ['$state', '$location', '$localStorage', '$scope', 'productService', 'categoryService', 'cartService'];

    function FoodController($state, $location, $localStorage, $scope, productService, categoryService, cartService) {
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
        vm.brandId = (typeof $location.search().brandId !== 'undefined' ?  JSON.parse("[" + $location.search().brandId + "]") : []);
        vm.keySearch = (typeof $location.search().name !== 'undefined' ?  $location.search().name : '');
        vm.sort = (typeof $location.search().sort !== 'undefined' ?  $location.search().sort : '');
        vm.limit = (typeof $location.search().limit !== 'undefined' ?  $location.search().limit : '12');
        vm.offset = (typeof $location.search().offset !== 'undefined' ?  $location.search().offset : 0);
        vm.ratePrice = (typeof $location.search().ratePrice !== 'undefined' ?  $location.search().ratePrice : '');
		
        vm.localCart = [];
        vm.totalCart = 0;

        if(typeof $localStorage.cart !== "undefined"){
            vm.localCart = $localStorage.cart;
        }
        if(typeof $localStorage.totalCart !== 'undefined'){
            vm.totalCart = $localStorage.totalCart;
        }
		
		if(vm.categoryId !== ''){
            getCategoryById(vm.categoryId);
        } else {
			$state.go('home');
		}

        function getCategoryById(catId) {
            return categoryService.getById(catId).then(function(response) {
                vm.category = response.data;
				
				if(vm.category.type != '2') {
					if(vm.category.type == '1') {
						$state.go('deals', {categoryId: vm.categoryId});
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
                vm.totalRecord = response.data ;
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
			$state.go('foods', {brandId: vm.brandId.toString(), sort: vm.sort, offset: vm.offset, limit: vm.limit, ratePrice: vm.ratePrice}, {notify: false});
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

        vm.addProductToCart = function (product, variantId) {
            var item = {product_id: product.id, name: product.name, image: product.image, price: product.compare_at_price, quantity: 1};
			
			vm.msgPopup = 'Đang xử lý...';
			$('#popupInfo').modal({
				escapeClose: false,
				clickClose: false,
				showClose: false
			});
			
            if(vm.localCart.length === 0){
                vm.localCart.push(item);
                $localStorage.cart = vm.localCart;
                vm.totalCart = vm.totalCart + product.compare_at_price;
                $localStorage.totalCart = vm.totalCart;
            } else {
                var count = 0;
                for(var i = 0; i < vm.localCart.length; i++){
                    if(vm.localCart[i].product_id === product.id){
                        count = 1;
                        vm.addProduct(product.id);
                    }
                } 
                if(count === 0){
                    vm.localCart.push(item);
                    $localStorage.cart = vm.localCart;
                    vm.totalCart = vm.totalCart + product.compare_at_price;
                    $localStorage.totalCart = vm.totalCart;
                }
            }
			vm.msgPopup = 'Đã thêm vào giỏ hàng thành công';
			setTimeout(function () {
				$("#popupInfo a.close").click();
			}, 1500);
        };

        vm.addProduct = function (id) {
            for (var i = 0; i < vm.localCart.length; i++) {
                if (vm.localCart[i].product_id == id && vm.localCart[i].quantity < 99) {
                    vm.localCart[i].quantity = vm.localCart[i].quantity + 1; 
                    vm.total = vm.total + vm.localCart[i].price;
                    $localStorage.total = vm.total;
                }
            }
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
			getProductsList();
        };

        vm.openBrand = function(brandId, type){
			if(typeof type !== 'undefined' && type == '1') {
				vm.brandId.splice(vm.brandId.indexOf(brandId), 1);
			} else {
				vm.brandId[vm.brandId.length] = brandId;
				vm.offset = 0;
			}
			getProductsList();
        };
		
		vm.openRatePrice = function(ratePrice, type) {
			if(typeof type !== 'undefined' && type == '1') {
				vm.ratePrice = '';
			} else {
				vm.ratePrice = ratePrice;
				vm.offset = 0;
			}
			getProductsList();
		};
		
		$scope.sort = function() {
			getProductsList();
		};
		
		$scope.limit = function() {
			getProductsList();
		};

        vm.openOtherDeal = function (provinceId) {
			$localStorage.provinceId = provinceId;
			$state.reload();
        };
		
    }
	
})();