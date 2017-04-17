(function () {
    'use strict';

    angular
        .module('gApp.product')
        .controller('ProductsDetailController', ProductsDetailController);

    ProductsDetailController.$inject = ['$state', '$stateParams', 'productService', 'categoryService', 'cartService', '$window', '$localStorage'];

    function ProductsDetailController($state, $stateParams, productService, categoryService, cartService, $window, $localStorage) {
        var vm = this;

        vm.product = {};
        vm.carts = {};
        vm.category = {};
        vm.parents = [];

        vm.option1Selected = '';
        vm.option2Selected = '';
        vm.option3Selected = '';
        vm.quantity = 1;

        vm.price = 0;
        vm.compareAtPrice = 0;
        vm.discountPercent = 0;
        vm.hasVariants = false;
        vm.variantId = null;
        vm.popMessage = '';
        vm.keySearch = '';
        vm.isAddingCart = false;
        vm.variantExtra = null;

        vm.accordionStatus1 = '';
        vm.accordionStatus2 = '';

        getProductById($stateParams.productId);
        function getProductById(productId) {
            return productService.findById(productId).then(function (response) {
                vm.product = response.data;
                if (vm.product.hasOwnProperty('variants')){
                    vm.hasVariants = true;
                    if (vm.product.options.hasOwnProperty('option3')) {
                        vm.option1Selected = vm.product.variants[0].option1;
                        vm.option2Selected = vm.product.variants[0].option2;
                        vm.option3Selected = vm.product.variants[0].option3;
                    }
                    else if (vm.product.options.hasOwnProperty('option2')) {
                        vm.option1Selected = vm.product.variants[0].option1;
                        vm.option2Selected = vm.product.variants[0].option2;
                    }
                    else {
                        vm.option1Selected = vm.product.variants[0].option1;
                    }
                    vm.variantId = vm.product.variants[0].id;
                    vm.price = vm.product.variants[0].price;
                    vm.compareAtPrice = vm.product.variants[0].compare_at_price;
                    vm.discountPercent = vm.product.variants[0].discount_percent;
                    vm.variantExtra = vm.product.variants[0].extra;
                }
                else {
                    vm.price = vm.product.price;
                    vm.compareAtPrice = vm.product.compare_at_price;
                    vm.discountPercent = vm.product.discount_percent;
                }
				getCategoryById(vm.product.category.id);
                return vm.product;
            });
        }

        vm.addProductToCart = function (isPayNow) {
            vm.isAddingCart = true;
            var item = {product_id: vm.product.id, product_variant_id : (vm.variantId!==null ? vm.variantId : 0), quantity: vm.quantity};
            $localStorage.totalItem += vm.quantity;
            return cartService.addProduct(item).then(function (response) {
                if (response === true) {
                    if (isPayNow === 1) {
                        if (typeof $localStorage.totalItem === 'undefined' || $localStorage.totalItem === 0) {
                            $localStorage.totalItem = vm.quantity;
                        }
                        $state.go("cart");
                        return false;
                    }
                    vm.popMessage = 'Đã thêm vào giỏ hàng thành công';
                    vm.isAddingCart = false;
                } else {
                    if (response.error.code === 10) {
                        vm.popMessage = 'Sản phẩm đã bị hủy hoặc không đủ hàng';
                    } else {
                        vm.popMessage = 'Có lỗi trong quá trình ghi nhận đơn hàng, vui lòng thử lại sau';
                    }
                    $('#popup').modal('show');
                    vm.isAddingCart = false;
                }
            }, function (response) {
                vm.popMessage = 'Có lỗi trong quá trình ghi nhận đơn hàng, vui lòng thử lại sau';
                $('#popup').modal('show');
                vm.isAddingCart = false;
            });
        };
		
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

        vm.addQuantity = function () {
            if (vm.quantity < 20) {
                vm.quantity++;
            }
        };
        vm.subQuantity = function () {
            if (vm.quantity > 1) {
                vm.quantity--;
            }
        };

        vm.changeOption1 = function (option1) {
            vm.option1Selected = option1;
            vm.option1Change();
            updatePrice();
        };

        vm.option1Change = function () {
            if (typeof vm.product.options === 'undefined') {
                return;
            }
            if (vm.product.options.hasOwnProperty('option2')) {
                for (var i = 0; i < vm.product.variants.length; i++) {
                    var variant = vm.product.variants[i];
                    if (variant.option1 == vm.option1Selected) {
                        vm.option2Selected = variant.option2;
                        vm.price = variant.price;
                        vm.compareAtPrice = variant.compare_at_price;
                        vm.discountPercent = variant.discount_percent;
                        vm.variantId = variant.id;
                        vm.variantExtra = variant.extra;
                        break;
                    }
                }
            } else {
                updatePrice();
            }
        };

        vm.option2Change = function () {
            if (typeof vm.product.options === 'undefined') {
                return;
            }
            if (vm.product.options.hasOwnProperty('option3')) {
                for (var i = 0; i < vm.product.variants.length; i++) {
                    var variant = vm.product.variants[i];
                    if (variant.option1 == vm.option1Selected && vm.option2Selected == variant.option2) {
                        vm.option3Selected = variant.option3;
                        vm.price = variant.price;
                        vm.compareAtPrice = variant.compare_at_price;
                        vm.discountPercent = variant.discount_percent;
                        vm.variantId = variant.id;
                        vm.variantExtra = variant.extra;
                        break;
                    }
                }
            } else {
                updatePrice();
            }
        };

        vm.changeOption2 = function (option2) {
            vm.option2Selected = option2;
            updatePrice();
        };

        vm.changeOption3 = function (option3) {
            vm.option3Selected = option2;
            updatePrice();
        };

        vm.closeScreen = function () {
            $window.history.back();
            $window.close();
        };

        vm.search = function () {
            $state.go('productsList', {name: vm.keySearch});
        };

        vm.openDescription = function () {
            $('#popupDescription').modal('show');
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
    }
})();