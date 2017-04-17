(function () {
    'use strict';

    angular
        .module('gApp.home')
        .controller('HomeController', HomeController)
        .directive('initBanner', initBanner);

    HomeController.$inject = ['categoryService', 'homeService' , 'bannerService', '$state', '$localStorage'];

    function HomeController(categoryService, homeService, $state, $localStorage) {
        var vm = this;

        vm.categories = [];
        vm.banners = [];
        vm.homeData = [];
        vm.keySearch = '';
        vm.homepage = [];
        vm.slides = [];
        vm.currIndex = 0;
        vm.myInterval = 5000;
        vm.noWrapSlides = false;
        vm.active = 0;
        vm.email = 1;

        delete $localStorage.products;
        delete $localStorage.scrollPos;
        delete $localStorage.offsetProductList;
        delete $localStorage.subMenu;

        $localStorage.isPrevious = false;
        $localStorage.scrollPos = [];
        $localStorage.products = [];
        $localStorage.offsetProductList = [];
        $localStorage.sort = '';
        $localStorage.sortType = '';
        $localStorage.previousCategory = '';
        $localStorage.previousSubCat = [];
        $localStorage.filterOffsetTop = 0;

        getCategories();
        getHomePage();
        

        function getCategories() {
            var param = {
                parent_id : 0
            };
            return categoryService.getList(param).then(function(response) {
                vm.categories = response.data;
                return vm.categories;
            });
        }

        vm.addEmail = function(data) {
            console.log(1);
            return homeService.addEmail(data).then(function(response) {
                vm.emailData = response.data;
                return vm.emailData;
            });
        };

        vm.search = function(){
            $state.go('productsList',{name:vm.keySearch});
        };

        function getHomePage(){
            return homeService.getHomePage().then(function(response) {
                vm.homeData = response.data;
                return vm.homeData;
            });
        }

        vm.slickConfig = {
            autoplay: true,
            infinite: true,
            autoplaySpeed: 1000,
            slidesToShow: 3,
            slidesToScroll: 3,
            method: {}
        };
    }

    function initBanner(){
        return {
            scope: false, //don't need a new scope
            restrict: 'A', //Attribute type
            link: function (scope, elements, attr){
                if (scope.$last) {
                    var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
                        spaceBetween: 0,
                        centeredSlides: true,
                        autoplay: 2500,
                        autoplayDisableOnInteraction: false,
                        loop: false,
                        loopedSlides: 0,
                        loopAdditionalSlides: 0,
                        preventClicksPropagation: false,
                        preventClicks:false
                    });
                }
            }
        };
    }
})();