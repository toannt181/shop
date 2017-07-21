(function () {
    'use strict';

    angular
        .module('gApp.cart')
        .controller('CartController', CartController);
        CartController.$inject = ['cartService', 'addressService', '$state', '$rootScope','$localStorage'];

    function CartController(cartService, addressService, $state, $rootScope, $localStorage) {
        var vm = this;

        vm.id = 0;
        vm.userCart = [];
        vm.addresses = [];
        vm.defaultAddress = [];
        vm.isEditMode = false;
        vm.totalItem = ($localStorage.totalItem === 0 || typeof $localStorage.totalItem === 'undefined') ? -1 : $localStorage.totalItem;
        vm.voucherMessage = '';
        $localStorage.voucherCode = '';
        vm.voucherCode = '';
        vm.voucherAmount = 0;
        vm.isUserVerified = false;
        vm.clientCart = $localStorage.clientCart;
        vm.totalPrice = $localStorage.totalPrice;
        vm.token = (typeof $localStorage.token === 'undefined')?0:1;

        // --Start Client Cart --

        if(typeof $localStorage.clientCart === 'undefined'){
            $localStorage.clientCart = [];
            $localStorage.totalPrice = 0;
            vm.totalPrice = $localStorage.totalPrice;
        } else if($localStorage.clientCart.length===0){
            $localStorage.totalPrice = 0;
             vm.totalPrice = $localStorage.totalPrice;
        } 

        $scope.$watch(function () { return $localStorage.totalPrice; },function(newVal,oldVal){
           vm.totalPrice = newVal;
        });

        vm.addProductClient = function (id) {
            for (var i = 0; i < $localStorage.clientCart.length; i++) {
                if ($localStorage.clientCart[i].product_id === id && $localStorage.clientCart[i].quantity < 99) {
                    $localStorage.clientCart[i].quantity = $localStorage.clientCart[i].quantity + 1; 
                    $localStorage.totalPrice = $localStorage.totalPrice + $localStorage.clientCart[i].price;
                    vm.clientCart = $localStorage.clientCart;
                }
            }
        };

        vm.removeProductClient = function (id) {
            for (var i = 0; i < $localStorage.clientCart.length; i++) {
                if ($localStorage.clientCart[i].product_id === id && $localStorage.clientCart[i].quantity > 1) {
                    $localStorage.clientCart[i].quantity = $localStorage.clientCart[i].quantity - 1;
                    $localStorage.totalPrice = $localStorage.totalPrice - $localStorage.clientCart[i].price;
                    vm.clientCart = $localStorage.clientCart;
                }
            }
        };

        vm.removeItemCartClient = function (id) {
            for(var i=0;i<$localStorage.clientCart.length;i++){
                if($localStorage.clientCart[i].product_id === id){
                    $localStorage.totalPrice = $localStorage.totalPrice - $localStorage.clientCart[i].price*$localStorage.clientCart[i].quantity;
                    vm.clientCart.splice(i,1);
                }
            }
            vm.clientCart = $localStorage.clientCart;
            vm.totalPrice =  $localStorage.totalPrice;
        };

        // -- End Client Cart --

        // -- Start User Cart --
        function getCart() {
            cartService.countItems().then(function (response) {
                vm.totalItem = Math.floor(response.data) === 0 ? -1 : Math.floor(response.data);
                if (vm.totalItem > 0) {
                    cartService.getCart(vm.voucherCode).then(function (response) {
                        vm.userCart = response.data;
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
                for (var i = 0; i < vm.userCart.length; i++) {
                    var add = {id: vm.userCart[i].id, quantity: vm.userCart[i].quantity};
                    cartAdd.push(add);
                }
                return cartService.updateCart(cartAdd, vm.voucherCode).then(function (response) {
                    if (response === false) {
                        vm.popMessage = 'Có lỗi trong quá trình cập nhật giỏ hàng, vui lòng thử lại sau';
                        $('#popupAlert').modal('show');
                    } else {
                        if (response.data.error) {
                            cartService.getCart(vm.voucherCode).then(function (response) {
                                vm.userCart = response.data;
                                vm.total = Math.floor(response.total_amount) - Math.floor(response.voucher_amount);
                                vm.voucherAmount = Math.floor(response.voucher_amount);
                                vm.isUserVerified = response.user_is_verify;
                            });
                            for (i = 0; i < vm.userCart.length; i++) {
                                if (vm.userCart[i].is_active === 0 || vm.userCart[i].is_active === '0') {
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
        //load client cart to user cart
        function updateCart() {
            var cartAdd = [];
                for (var i = 0; i < vm.clientCart.length; i++) {
                    var add = {id: vm.clientCart[i].product_id, quantity: vm.clientCart[i].quantity};
                    cartAdd.push(add);
                }
                return cartService.updateCart(cartAdd, vm.voucherCode).then(function (response) {
                    if (response === false) {
                        vm.popMessage = 'Có lỗi trong quá trình cập nhật giỏ hàng, vui lòng thử lại sau';
                        $('#popupAlert').modal('show');
                    } else {
                        if (response.data.error) {
                            cartService.getCart(vm.voucherCode).then(function (response) {
                                vm.userCart = response.data;
                                vm.total = Math.floor(response.total_amount) - Math.floor(response.voucher_amount);
                                vm.voucherAmount = Math.floor(response.voucher_amount);
                                vm.isUserVerified = response.user_is_verify;
                            });
                            for (i = 0; i < vm.userCart.length; i++) {
                                if (vm.userCart[i].is_active === 0 || vm.userCart[i].is_active === '0') {
                                    vm.popMessage = 'Có sản phẩm đã bị hủy hoặc không đủ hàng, vui lòng kiểm tra lại giỏ hàng';
                                }
                            }
                            $('#popupAlert').modal('show');
                        } else {
                            vm.userCart = response.data;
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

        }

        vm.addProductUser = function (cartid) {
            for (var i = 0; i < vm.userCart.length; i++) {
                if (vm.userCart[i].id == cartid && vm.userCart[i].quantity < 99) {
                    vm.userCart[i].quantity = vm.userCart[i].quantity + 1;
                    vm.total = vm.total + vm.userCart[i].price;
                    vm.totalItem = vm.totalItem + 1;
                    $localStorage.totalItem = vm.totalItem;
                    var item = {
                        product_id: vm.userCart[i].product_id,
                        product_variant_id: (vm.userCart[i].product_variant_id!==null ? vm.userCart[i].product_variant_id : 0),
                        quantity: 1
                    };
                    return cartService.addProduct(item);
                }
            }
        };
        
        vm.removeProductUser = function (cartid) {
            for (var i = 0; i < vm.userCart.length; i++) {
                if (vm.userCart[i].id == cartid && vm.userCart[i].quantity > 1) {
                    vm.userCart[i].quantity = vm.userCart[i].quantity - 1;
                    vm.total = vm.total - vm.userCart[i].price;
                    vm.totalItem = vm.totalItem - 1;
                    $localStorage.totalItem = vm.totalItem;

                    var item = {
                        product_id: vm.userCart[i].product_id,
                        product_variant_id: (vm.userCart[i].product_variant_id!==null ? vm.userCart[i].product_variant_id : 0),
                        quantity: -1
                    };
                    return cartService.addProduct(item);
                }
            }
        };

        vm.removeItemCartUser = function (id) {
            vm.id = id;
        };

        vm.submitRemove = function () {
            var whatIndex = null;
            angular.forEach(vm.userCart, function (cb, index) {
                if (cb.id === vm.id) {
                    whatIndex = index;
                }
            });
            if (vm.userCart[whatIndex].id == vm.id) {
                $localStorage.totalItem = $localStorage.totalItem - vm.userCart[whatIndex].quantity;
                vm.userCart.splice(whatIndex, 1);
            }
            vm.updateCart();
            $('#confirm-delete').modal('hide');
            if(vm.userCart.length === 0){
                vm.totalItem = -1;
            }
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

        //-- End User Cart -- 

        vm.openDetail = function(productId){
            $state.go('productsDetail',{productId: productId});
        };

        vm.goState = function(state){
            $state.go(state);
        };
        
        vm.goToConfirm = function (paymentMethod) {
            // updateCart();
            // console.log(vm.userCart);
            $state.go("cartConfirm");
        };
    }
    
})();