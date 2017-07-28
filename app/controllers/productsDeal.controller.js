(function () {
    'use strict';

    angular
        .module('gApp.product')
        .controller('ProductsDealController', ProductsDealController);

    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);

    ProductsDealController.$inject = ['$state', '$location', 'productService', 'categoryService', '$localStorage', '$timeout', '$window', '$scope'];

    function ProductsDealController($state, $location, productService, categoryService, $localStorage, $timeout, $window, $scope) {
        var vm = this;

        vm.provinces = [];
        vm.products = [];
        vm.offset = 0;
        vm.busy = false;
        vm.limit = 12;
        vm.hasData = true;
        vm.categories = [];
        vm.showMoreCat = false;
		
        vm.sort = (typeof $localStorage.sort !== 'undefined' ? $localStorage.sort : '');
        vm.sortType = (typeof $localStorage.sortType !== 'undefined' ? $localStorage.sortType : '');
        vm.categoryId = (typeof $location.search().categoryId !== 'undefined' ? $location.search().categoryId : '');

        vm.provinceId = (typeof $location.search().provinceId !== 'undefined' ? $location.search().provinceId : (typeof $localStorage.provinceId !== 'undefined' ? $localStorage.provinceId : ''));
        vm.provinceName = '';
        vm.categoryName = '';

        if (vm.provinceId !== '')
            $localStorage.provinceId = vm.provinceId;

        if (typeof $localStorage.offsetProductList === 'undefined')
            $localStorage.offsetProductList = [];

        if (typeof $localStorage.products === 'undefined')
            $localStorage.products = [];

        if (typeof vm.products === 'undefined' || vm.products.length === 0) 
            getProductsDeal();
        
        if(typeof $localStorage.previousCategory === 'undefined')
            $localStorage.previousCategory = '';

        // Khai bao du lieu khi back lai page
        function gotoPreviousPosition() {
			if($localStorage.previousCategory === $location.search().categoryId){
                vm.products = typeof $localStorage.products[vm.categoryId + '_' + vm.sort] !== 'undefined' ? $localStorage.products[vm.categoryId + '_' + vm.sort] : [];
                vm.offset = typeof $localStorage.offsetProductList[vm.categoryId + '_' + vm.sort] !== 'undefined' ? $localStorage.offsetProductList[vm.categoryId + '_' + vm.sort] : 0;
                vm.categories = $localStorage.previousSubCat;
                $timeout(function(){
                    keepScrolling(0);
                }, 50);
            } else {
				delete $localStorage.products;
				delete $localStorage.scrollPos;
				delete $localStorage.offsetProductList;
				
                $localStorage.previousCategory = vm.categoryId;

				$localStorage.isPrevious = false;
				$localStorage.scrollPos = [];
				$localStorage.products = [];
				$localStorage.offsetProductList = [];

				$localStorage.previousSubCat = [];
				delete $localStorage.sortType;
				delete $localStorage.sort;
				vm.sort = '';
				vm.sortType = '';
				$localStorage.filterOffsetTop = 0;
			}
        }

        getProvinces();
        function getProvinces() {
            productService.getListProvinces().then(function (response) {
                vm.provinces = response.data;
                for (var key in vm.provinces) {
                    if (vm.provinces[key].province_id == vm.provinceId) {
                        vm.provinceName = vm.provinces[key].province;
                        break;
                    }
                }
                return vm.provinces;
            });
        }

        function keepScrolling(currentTop) {
            var scrollPosition = $localStorage.scrollPos[vm.categoryId + '_' + vm.sort] ? $localStorage.scrollPos[vm.categoryId + '_' + vm.sort] : 0;
            var top = $(document).height() - $(window).height();

            if (scrollPosition < top) {
                if ($localStorage.filterOffsetTop > 0) {
                    if (scrollPosition >= $localStorage.filterOffsetTop) {
                        $("#filter").addClass("filter-fixed-position");
                    } else {
                        $("#filter").removeClass("filter-fixed-position");
                    }
                }
                $(window).scrollTop(scrollPosition);

                return false;
            } else {
                $timeout(function () {
                    keepScrolling(top);
                }, 50);
            }
        }

        gotoPreviousPosition();

        getCategories();
        function getCategories() {
            return categoryService.getById(vm.categoryId).then(function (response) {
                vm.categories = response.data;
                $localStorage.previousSubCat = vm.categories;
                return vm.categories;
            });
        }
        // console.log(vm.products);
        function getProductsDeal() {
            var params = [
                {name: 'category_id', value: vm.categoryId},
                {name: 'province_id', value: vm.provinceId}
            ];

            if (vm.sort !== '') {
                params.push({name: 'sort', value: vm.sort});
                params.push({name: 'sort_type', value: vm.sortType});
            }
			
            productService.getListDeal(params, vm.offset, vm.limit).then(function (response) {
                console.log(response.data);
                vm.products = response.data;
                vm.offset = vm.products.length;
                $localStorage.products[vm.categoryId + '_' + vm.sort] = vm.products;
                $localStorage.offsetProductList[vm.categoryId + '_' + vm.sort] = vm.offset;
                $localStorage.scrollPos[vm.categoryId + '_' + vm.sort] = $(window).scrollTop();
                vm.hasData = vm.products.length === 0 ? false : true;
                return vm.products;
            });
        }

        vm.loadMore = function () {
            if (vm.busy || vm.offset === 0) return;
            vm.busy = true;
            var params = [
                {name: 'category_id', value: vm.categoryId},
                {name: 'province_id', value: vm.provinceId}
            ];

            if (vm.sort !== '') {
                params.push({name: 'sort', value: vm.sort});
                params.push({name: 'sort_type', value: vm.sortType});
            }

            productService.getListDeal(params, vm.offset, vm.limit).then(function (response) {
                vm.products = vm.products.concat(response.data);
                $localStorage.products[vm.categoryId + '_' + vm.sort] = vm.products;
                vm.offset = vm.products.length;
                $localStorage.offsetProductList[vm.categoryId + '_' + vm.sort] = vm.offset;
                if (response.data.length === vm.limit) {
                    vm.busy = false;
                }
                return vm.products;
            });
        };

        vm.getProductsDealByType = function (sort, direction) {
            if (vm.sort === sort && vm.sort !== 'price') {
                return false;
            }
            vm.sort = sort;
            vm.sortType = direction;
            $localStorage.sort = sort;
            $localStorage.sortType = direction;
            var params = [
                {name: 'category_id', value: vm.categoryId},
                {name: 'province_id', value: vm.provinceId}
            ];
            if (vm.sort !== '') {
                params.push({name: 'sort', value: vm.sort});
                params.push({name: 'sort_type', value: vm.sortType});
            }
			
            productService.getListDeal(params, 0, vm.limit).then(function (response) {
                vm.products = response.data;
                vm.offset = vm.products.length;
                if ($localStorage.filterOffsetTop > 0) {
                    $(window).scrollTop($localStorage.filterOffsetTop - 43);
                }
                $localStorage.products[vm.categoryId + '_' + vm.sort] = vm.products;
                $localStorage.offsetProductList[vm.categoryId + '_' + vm.sort] = vm.offset;
                $localStorage.scrollPos[vm.categoryId + '_' + vm.sort] = $(window).scrollTop();
                vm.hasData = vm.products.length === 0 ? false : true;
                return vm.products;
            });
        };

        vm.openDetail = function (productId) {
            $localStorage.isPrevious = true;
            $localStorage.scrollPos[vm.categoryId + '_' + vm.sort] = $(window).scrollTop();
            $localStorage.previousSubCat = vm.categories;
            //$localStorage.filterOffsetTop = $("#filter").offset().top;
            vm.busy = true;
            $state.go('productsDetail', {productId: productId});
        };
    }
})();