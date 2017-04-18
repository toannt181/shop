(function () {
    'use strict';

    angular
        .module('gApp.cart')
        .controller('CartController', CartController);
        CartController.$inject = ['cartService', 'addressService', '$state', '$scope', '$rootScope','$localStorage'];

    function CartController(cartService, addressService, $state, $scope, $rootScope, $localStorage) {
        var vm = this;
        vm.id = 0;
        vm.cart = [];
        vm.addresses = [];
        vm.defaultAddress = [];
        vm.total = 0;
        vm.isEditMode = false;
        vm.totalItem = ($localStorage.totalItem === 0 || typeof $localStorage.totalItem === 'undefined') ? -1 : $localStorage.totalItem;
        vm.voucherMessage = '';
        $localStorage.voucherCode = '';
        vm.voucherCode = '';
        vm.voucherAmount = 0;
        vm.isUserVerified = false;
        vm.countCartItems = $localStorage.totalItem;

        getCart();
        function getCart() {
            cartService.countItems().then(function (response) {
                vm.totalItem = Math.floor(response.data) === 0 ? -1 : Math.floor(response.data);

                if (vm.totalItem > 0) {
                    cartService.getCart(vm.voucherCode).then(function (response) {
                        vm.cart = response.data;
                        vm.total = Math.floor(response.total_amount) - Math.floor(response.voucher_amount);
                        vm.voucherAmount = Math.floor(response.voucher_amount);
                        vm.isUserVerified = response.user_is_verify;
                    });
                }
            });
        }

        vm.editCart = function () {
            removeVoucher();
            vm.isEditMode = true;
        };

        vm.updateCart = function () {
            var cartAdd = [];
                for (var i = 0; i < vm.cart.length; i++) {
                    var add = {id: vm.cart[i].id, quantity: vm.cart[i].quantity};
                    cartAdd.push(add);
                }
                return cartService.updateCart(cartAdd, vm.voucherCode).then(function (response) {
                    if (response === false) {
                        vm.popMessage = 'Có lỗi trong quá trình cập nhật giỏ hàng, vui lòng thử lại sau';
                        $('#popupAlert').modal('show');
                    } else {
                        if (response.data.error) {
                            cartService.getCart(vm.voucherCode).then(function (response) {
                                vm.cart = response.data;
                                vm.total = Math.floor(response.total_amount) - Math.floor(response.voucher_amount);
                                vm.voucherAmount = Math.floor(response.voucher_amount);
                                vm.isUserVerified = response.user_is_verify;
                            });
                            for (i = 0; i < vm.cart.length; i++) {
                                if (vm.cart[i].is_active === 0 || vm.cart[i].is_active === '0') {
                                    vm.popMessage = 'Có sản phẩm đã bị hủy hoặc không đủ hàng, vui lòng kiểm tra lại giỏ hàng';
                                }
                            }
                            $('#popupAlert').modal('show');
                        } else {
                            vm.voucherAmount = Math.floor(response.data.voucher_amount);
                            vm.total = Math.floor(response.data.total_amount) - Math.floor(response.data.voucher_amount);
                            vm.isEditMode = false;
                            if (vm.totalItem === 0) {
                                vm.totalItem = -1;
                            }
                        }

                    }
                }, function (response) {
                    vm.popMessage = 'Có lỗi trong quá trình cập nhật giỏ hàng, vui lòng thử lại sau';
                    $('#popupAlert').modal('show');
                });

        };

        vm.addCart = function (cartid) {
            for (var i = 0; i < vm.cart.length; i++) {
                if (vm.cart[i].id == cartid && vm.cart[i].quantity < 99) {
                    vm.cart[i].quantity = vm.cart[i].quantity + 1;
                    vm.total = vm.total + vm.cart[i].price;
                    vm.totalItem = vm.totalItem + 1;
                    $localStorage.totalItem = vm.totalItem;
                    var item = {
                        product_id: vm.cart[i].product_id,
                        product_variant_id: (vm.cart[i].product_variant_id!==null ? vm.cart[i].product_variant_id : 0),
                        quantity: 1
                    };
                    // angular.element(document.getElementById('footer')).scope().footerCtrl.countCartItems = $localStorage.totalItem;
                    console.log(item);
                    return cartService.addProduct(item);
                }
            }
        };
		
        vm.removeCart = function (cartid) {
            for (var i = 0; i < vm.cart.length; i++) {
                if (vm.cart[i].id == cartid && vm.cart[i].quantity > 1) {
                    vm.cart[i].quantity = vm.cart[i].quantity - 1;
                    vm.total = vm.total - vm.cart[i].price;
                    vm.totalItem = vm.totalItem - 1;
                    $localStorage.totalItem = vm.totalItem;

                    var item = {
                        product_id: vm.cart[i].product_id,
                        product_variant_id: (vm.cart[i].product_variant_id!==null ? vm.cart[i].product_variant_id : 0),
                        quantity: -1
                    };

                    // angular.element(document.getElementById('footer')).scope().footerCtrl.countCartItems = $localStorage.totalItem;
                    return cartService.addProduct(item);

                }
            }
        };

        vm.removeItemCart = function (id) {
            vm.id = id;
        };

        vm.submitRemove = function () {
            var whatIndex = null;
            angular.forEach(vm.cart, function (cb, index) {
                if (cb.id === vm.id) {
                    whatIndex = index;
                }
            });
            if (vm.cart[whatIndex].id == vm.id) {
                $localStorage.totalItem = $localStorage.totalItem - vm.cart[whatIndex].quantity;
                vm.cart.splice(whatIndex, 1);
            }

            vm.updateCart();
            // angular.element(document.getElementById('footer')).scope().footerCtrl.countCartItems = $localStorage.totalItem;
            $('#confirm-delete').modal('hide');

            if(vm.cart.length === 0){
                vm.totalItem = -1;
            }
        };

        vm.goToConfirm = function (paymentMethod) {
			$state.go("cartConfirm");
        };

        vm.updateVoucher = function () {
            if (vm.voucherCode) {
                return cartService.updateVoucher(vm.voucherCode).then(function (response) {
                    if (response === false) {
                        vm.voucherMessage = 'Mã giảm giá không hợp lệ';
                    } else {
                        vm.voucherAmount = Math.floor(response.data.voucher_amount);
                        vm.total = Math.floor(response.data.total_amount) - Math.floor(response.data.voucher_amount);
                        vm.voucherMessage = '';
                    }
                }, function (response) {
                    vm.voucherMessage = 'Mã giảm giá không hợp lệ';
                });
            }
            return false;
        };

        vm.removeVoucher = removeVoucher;

        function removeVoucher() {
            vm.voucherCode = '';
            vm.total = vm.total + vm.voucherAmount;
            vm.voucherAmount = 0;
        }

        vm.inputVoucher = function () {
            vm.voucherMessage = '';
        };

        vm.openDetail = function(productId){
            $state.go('productsDetail',{productId: productId});
        };

    }
    
})();