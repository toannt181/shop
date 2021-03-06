(function () {
    'use strict';

    angular
        .module('gApp.category')
        .controller('ProductsListController', ProductsListController);
        ProductsListController.$inject = ['$state', '$location', '$localStorage', '$scope', 'productService', 'categoryService', 'cartService'];

    function ProductsListController($state, $location, $localStorage, $scope, productService, categoryService, cartService) {
        var vm = this;

        vm.id = 0;
        vm.paging = [];
        vm.brands = [];
        vm.category = [];
        vm.parents = [];
        vm.cart = [];
        vm.products = [];
        vm.subMenu = [];
        vm.busy = false;
        vm.hasData = true;
        vm.isSearch = false;
        vm.totalPage = 0;
        vm.totalRecord = 0;
        vm.total = 0;
        vm.totalFee = 0;
        vm.pageCurrent = 0;

        vm.categoryId = (typeof $location.search().categoryId !== 'undefined' ?  $location.search().categoryId : '');
        vm.brandId = (typeof $location.search().brandId !== 'undefined' ?  $location.search().brandId : '');
        vm.keySearch = (typeof $location.search().name !== 'undefined' ?  $location.search().name : '');
        vm.sort = (typeof $location.search().sort !== 'undefined' ?  $location.search().sort : '');
        vm.limit = (typeof $location.search().limit !== 'undefined' ?  $location.search().limit : 12);
        vm.offset = (typeof $location.search().offset !== 'undefined' ?  $location.search().offset : 0);
        vm.ratePrice = (typeof $location.search().ratePrice !== 'undefined' ?  $location.search().ratePrice : '');

        function getBrands(catId) {
            return categoryService.getBrands(catId).then(function(response) {
                vm.brands = response.data;
                return vm.brands;
            });
        }

        if(typeof $localStorage.clientCart === 'undefined'){
            $localStorage.clientCart = [];
            $localStorage.totalPrice = 0;
        } else if($localStorage.clientCart.length===0){
            $localStorage.totalPrice = 0;
        }

		if(vm.categoryId !== ''){
            getCategoryById(vm.categoryId);
        } else {
			$state.go('home');
		}

        function getCategoryById(catId) {
            return categoryService.getById(catId).then(function(response) {
                vm.category = response.data;
				
				if(vm.category.type != '0') {
					if(vm.category.type == '2') {
						$state.go('foods', {categoryId: vm.categoryId});
					} else if(vm.category.type == '1') {
						$state.go('deals', {categoryId: vm.categoryId});
					}
				}
				getProductsList();
				getBrands(vm.categoryId);
				
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
        }

        //Cart
        
        vm.addProductToCart = function (product, variantId) {
            var item = {product_id: product.id, name: product.name, image: product.image, price: product.compare_at_price, quantity: 1};			
            if($localStorage.clientCart.length === 0){
                $localStorage.clientCart.push(item);
                $localStorage.totalPrice = $localStorage.totalPrice + product.compare_at_price;
            } else {
                var count = 0;
                for(var i = 0; i < $localStorage.clientCart.length; i++){
                    if($localStorage.clientCart[i].product_id === product.id){
                        count = 1;
                        vm.addProduct(product.id);
                    }
                } 
                if(count === 0){
                    $localStorage.clientCart.push(item);
                    $localStorage.totalPrice = $localStorage.totalPrice + product.compare_at_price;
                }
            }
        };

        vm.addProduct = function (id) {
            for (var i = 0; i < $localStorage.clientCart.length; i++) {
                if ($localStorage.clientCart[i].product_id == id && $localStorage.clientCart[i].quantity < 99) {
                    $localStorage.clientCart[i].quantity = $localStorage.clientCart[i].quantity + 1; 
                    $localStorage.totalPrice = $localStorage.totalPrice + $localStorage.clientCart[i].price;  
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

        vm.openBrand = function(brandId, type){
			if(typeof type !== 'undefined' && type == '1') {
				$state.go('products', {brandId: ''});
			} else {
				$state.go('products', {brandId: brandId, offset:0});
			}
        };
		
        vm.openCartComfirm = function(){
            $state.go('cartConfirm');
        };

		vm.openRatePrice = function(ratePrice, type) {
			if(typeof type !== 'undefined' && type == '1') {
				$state.go('products', {ratePrice: ''});
			} else {
				$state.go('products', {ratePrice: ratePrice, offset:0});
			}
		};
		
		$scope.sort = function() {
			$state.go('products', {sort: vm.sort});
		};
		
		$scope.limit = function() {
			$state.go('products', {limit: vm.limit});
		};
		
    }
	
})();