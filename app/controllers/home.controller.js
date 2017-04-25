(function () {
    'use strict';

    angular
        .module('gApp.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['categoryService', 'homeService', '$localStorage', '$scope', '$state'];

    function HomeController(categoryService, homeService, $localStorage, $scope, $state) {
        var vm = this;

        vm.categories = [];
        vm.homeData = [];
        vm.homeNewData = [];
        vm.productId = '';
        vm.catId = '';
		vm.provinceId = $localStorage.provinceId;
		vm.count = 0;
		vm.type = 0;
		
        getHomePage();
        if (typeof $localStorage.subMenu == 'undefined') {
            getSubMenu();
        } else {
			vm.categories = $localStorage.subMenu;
		}

        function getSubMenu() {
            return categoryService.getAllCategories().then(function (response) {
                vm.categories = response.data;
				$localStorage.subMenu = vm.categories;
                return;
            });
        }
		
        vm.addEmail = function(data) {
            return homeService.addEmail(data).then(function(response) {
                vm.emailData = response.data;
                return vm.emailData;
            });
        };

        function getHomePage(){
			var count = 0;
            return homeService.getHomePage().then(function(response) {
                vm.homeData = response.data;
				$.each(response.data, function (index, value) {
					var details = {};
					$.each(value.details, function (i, val) {
						details[val.sort_weigh] = val;
					});
					if(value.type == 2) count++;
					value.className = count%3==1 ? 'blue' : count%3==2 ? 'yellow' : 'green';
					value.newDetails = details;
					vm.homeNewData[value.type] = value;
					vm.homeData[index] = value;
				});
				return vm.homeData;
                // vm.homeData = response.data;
                // return vm.homeData;
            });
        }

        vm.openCategory = function (catId, typeId) {
            if (typeof typeId !== 'undefined' && typeId != '0') {
				if (typeId == 1) {
					vm.catId = catId;
					if(typeof $localStorage.provinceId === 'undefined') {
						$('#popupHomeProvince').modal({
							escapeClose: false,
							clickClose: false,
							showClose: false
						});
					} else {
						$state.go("deals", {categoryId: catId});
					}
				} else {
					$state.go("foods", {categoryId: catId});
                }
            } else {
                $state.go("products", {categoryId: catId});
            }
        };

        vm.openHomeDeal = function () {
			$localStorage.provinceId = vm.provinceId;
			$state.go("deals", {categoryId: vm.catId});
        };
		
		$scope.showDeal = function(productHome, catId, type){
			vm.catId = catId;
			vm.type = type;
			vm.productHome = productHome;
		};
    }
})();