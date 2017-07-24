(function () {
    'use strict';

    angular
        .module('gApp.product')
        .controller('ProvincesController', ProvincesController);

    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);

    ProvincesController.$inject = ['$state', '$location', 'productService', '$localStorage', '$window', '$scope'];

    function ProvincesController($state, $location, productService, $localStorage, $window, $scope) {
        var vm = this;

        vm.provinces = [];
        vm.provinceId = '';
        vm.categoryId = '';
		
		
        if(typeof vm.provinces === 'undefined' || vm.provinces.length === 0){
            getProvinces();
        }

        function getProvinces() {
            productService.getListProvinces().then(function(response) {
                vm.provinces = response.data;
                return vm.provinces;
            });
        }
		
		vm.addProvince = function(){
            $localStorage.provinceId = vm.provinceId;
			vm.categoryId = (typeof $location.search().categoryId !== 'undefined' ?  $location.search().categoryId : '');
			var typeId = (typeof $location.search().typeId !== 'undefined' ?  $location.search().typeId : '');
			if(typeId == 1) {
				$state.go("productsDeal", {categoryId: vm.categoryId});
			} else {
				$state.go("suppliersList", {categoryId: vm.categoryId});
			}
        };

    }
})();