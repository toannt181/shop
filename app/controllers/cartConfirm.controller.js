(function () {
    'use strict';

    angular
        .module('gApp.cart')
        .controller('CartConfirmController', CartConfirmController);
        CartConfirmController.$inject = ['cartService', 'addressService', 'orderService', '$state', '$scope', '$localStorage'];

    function CartConfirmController(cartService, addressService, orderService, $state, $scope, $localStorage) {
        var vm = this;
        vm.id = 0;
        vm.cart = [];
        vm.addresses = [];
        vm.defaultAddress = [];
        vm.total = 0;
        vm.totalItem = ($localStorage.totalItem === 0 || typeof $localStorage.totalItem === 'undefined') ? -1 : $localStorage.totalItem;
        vm.voucherMessage = '';
        $localStorage.voucherCode = '';
        vm.voucherCode = '';
        vm.voucherAmount = 0;
        vm.isUserVerified = false;
        vm.countCartItems = $localStorage.totalItem;
		
        vm.provinces = [];
        vm.districts = [];

        getCart();
        getDefaultAddresses();
        getAddresses();
        getProvinces();
		
        function getDefaultAddresses() {
            return addressService.getDefaultAddress().then(function (response) {
                vm.defaultAddress = response.data;
                return vm.defaultAddress;
            });
        }
		
        function getAddresses() {
            return addressService.getAddresses().then(function (response) {
                vm.addresses = response.data;
                return vm.addresses;
            });
        }

        function getProvinces(){
            return addressService.getProvinces().then(function (response) {
                vm.provinces = response.data;
                vm.name = '';
                vm.phone = '';
                vm.districts = [];
                vm.provinceId = '';
                vm.districtId = '';
                return vm.provinces;
            });
        }

        vm.setDefault = function(id){
            if(id === ''){
                vm.popMessage = 'Quý khách vui lòng chọn địa chỉ giao hàng';
                $('#popup').modal('show');
            } else {
                return addressService.setDefaultAddress(id).then(function (response) {
                    if(response === true){
                        // $state.go("cartConfirm",{paymentMethod:$localStorage.payment_method});
                    } else {
                        vm.popMessage = 'Có lỗi trong quá trình ghi nhận địa chỉ, vui lòng thử lại sau';
                        $('#popupAlert').modal('show');
                    }
                });
            }          
        };

        vm.addAddress = function(){
            vm.phone = vm.phone.replace(/\D/g,'');
            if(vm.name === '' || vm.phone === '' || vm.districtId === '' || vm.address === ''){
                vm.popMessage = 'Quý khách vui lòng nhập đầy đủ thông tin địa chỉ';
                $('#popupAlert').modal('show');
            } else if(vm.phone.length > 13 || vm.phone.length < 9){
                vm.popMessage = 'Quý khách vui lòng kiểm tra lại số điện thoại đặt hàng';
                $('#popupAlert').modal('show');
            } else {
                var param = {'name':vm.name, 'phone':vm.phone, 'district_id':vm.districtId,'address':vm.address,'email':vm.email};
                return addressService.addAddress(param).then(function (response) {
                    if(response === true){
                        $state.go("cartConfirm", {paymentMethod:$localStorage.payment_method});
                    } else {
                        vm.popMessage = 'Có lỗi trong quá trình ghi nhận địa chỉ, vui lòng thử lại sau';
                        $('#popupAlert').modal('show');
                    }
                });
            }
        };
        
        vm.chooseDistrict = function() {
            if(vm.provinceId === '') {
                vm.districts = [];
                vm.districtId = '';
            } else {
                vm.districts = vm.provinces[vm.provinceId].districts;
                vm.districtId = '';
            }
        };

        vm.createOrder = function(payment_method){
            if(vm.defaultAddress === null || vm.defaultAddress === ''){
                vm.popMessage = 'Quý khách vui lòng nhập địa chỉ giao hàng';
                $('#popup').modal('show');
                return;
            }

            var cartAdd = [];

            for (var i = 0; i < vm.cart.length; i++) {
                cartAdd.push(vm.cart[i].id);
            }
            var orderAdd = {payment_method:payment_method, address_id:vm.defaultAddress.id, carts:cartAdd, note:vm.note, voucher:$localStorage.voucherCode};
            return orderService.create(orderAdd).then(function (response) {
                if(response.data){
                    if(payment_method === 0){
                        $state.go("ordersSuccess",{orderId:response.data.order_id});
                    } else {
                        $window.location.href = response.data.link;
                    }
                    return;
                }else{
                    vm.popMessage = 'Có lỗi trong quá trình ghi nhận đơn hàng, vui lòng thử lại sau';
                    if(response.error.message === "Quantity error"){
                        vm.popMessage = 'Có sản phẩm đã bị hủy hoặc không đủ hàng, vui lòng kiểm tra lại giỏ hàng';
                    }else if(response.error.message === "Product only accept pay_now"){
                        vm.popMessage = 'Sản phẩm trong giỏ hàng không hỗ trợ phương thức thanh toán trả sau';
                    }
                    $('#popupAlert').modal('show');
                }
            }, function (response) {
                console.log(response);
                vm.popMessage = 'Có lỗi trong quá trình ghi nhận đơn hàng, vui lòng thử lại sau';
                if(response.error.message === "Quantity error"){
                    vm.popMessage = 'Có sản phẩm đã bị hủy hoặc không đủ hàng, vui lòng kiểm tra lại giỏ hàng';
                }else if(response.error.message === "Product only accept pay_now"){
                    vm.popMessage = 'Sản phẩm trong giỏ hàng không hỗ trợ phương thức thanh toán trả sau';
                }
                $('#popupAlert').modal('show');
            });
        };

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

        vm.openDetail = function(productId){
            $state.go('productsDetail',{productId: productId});
        };
    }
    
})();