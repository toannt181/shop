(function () {
    'use strict';

    angular
        .module('gApp.shared')
        .controller('FooterController', FooterController);

    FooterController.$inject = ['$state','homeService', '$localStorage', '$location'];

    function FooterController($state, homeService ,$localStorage, $location) {

        var vm = this;

        vm.countCartItems = $localStorage.totalItem;
        vm.countNotifications = 0;
        vm.state = '';
        if($state.current.name !== 'productsList') {
            $(window).scrollTop(0);
        }
        vm.addEmail = function(data) {
            return homeService.addEmail(data).then(function(response) {
                    vm.emailData = response.data;
                    vm.msgPopup = 'Đăng ký email thành công';
                    $('#footerPopup').modal('show');
                    return vm.emailData;
            });
        };


        // getActiveMenu();
        // countCartItems();
        // countNotifications();

        // socketioService.on('notifications:count-cart-updated', updateCountCartItems);

        // socketioService.on('notifications:count-notifications-updated', updateCountNotifications);

        function countCartItems() {
            return cartService.countItems().then(function(response) {
                updateCountCartItems(response.data);
            });
        }

        function countNotifications() {
            return notificationService.count().then(function(response) {
                updateCountNotifications(response.data);
            });
        }

        function getActiveMenu() {
            switch ($state.current.name) {
                case 'home':
                case 'productsList':
                case 'productsDetail':
                case 'collection':
                case 'article':
                    vm.state = "home";
                    break;
                case 'cart':
                case 'cartConfirm':
                case 'addressesAdd':
                case 'addressesChoose':
                    vm.state = "cart";
                    break;
                case 'notifications':
                    vm.state = "notifications";
                    break;
                case 'ordersList':
                case 'ordersDetail':
                case 'ordersSuccess':
                    vm.state = "order";
                    break;
                default:
                    vm.state = 'home';
                    break;
            }
            return vm.state;
        }

        function updateCountCartItems(data) {
            vm.countCartItems = data;
            $localStorage.totalItem = Math.floor(data);
            return vm.countCartItems;
        }

        function updateCountNotifications(data) {
            vm.countNotifications = data;

            return vm.countNotifications;
        }

         vm.goState = function(state){
             if($state.current.name === 'productsList'){
                 $localStorage.isPrevious = true;
                 var categoryId = (typeof $location.search().categoryId !== 'undefined' ?  $location.search().categoryId : '');
                 var keySearch = (typeof $location.search().name !== 'undefined' ?  $location.search().name : '');
                 $localStorage.scrollPos[categoryId + '_' + keySearch] = $(window).scrollTop();
             }
             if(state === 'notifications'){
                 $localStorage.notificationType = 1;
             }
             console.log($state.current.name);
             console.log(state);
             if($state.current.name !== state){
                 $localStorage.isShowMenu = false;
             }
             $state.go(state);
         };
    }


    $(document)
        .on('focusin', 'input, textarea', function () {
            var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !/Windows Phone/.test(navigator.userAgent);
            if (iOS) {
                $("header").addClass('unfixed');
                $("footer").addClass('unfixed');
                $("#filter").addClass('unfixed');
            }
        })
        .on('focusout', 'input, textarea', function () {
            var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !/Windows Phone/.test(navigator.userAgent);
            if (iOS) {
                $("header").removeClass('unfixed');
                $("footer").removeClass('unfixed');
                $("#filter").removeClass('unfixed');
            }
        });       

})();