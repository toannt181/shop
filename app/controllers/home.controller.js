(function () {
    'use strict';

    angular
        .module('gApp.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['categoryService', 'homeService', '$state'];

    function HomeController(categoryService, homeService, $state) {
        var vm = this;

        vm.categories = [];
        vm.homeData = [];

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
                // for ( var index = 0; index < vm.homeData.length; index++ ) {
                //     vm.homeData[index].push({detail_new:{}});
                //     var tmp = vm.homeData[index].detail;
                //     for ( var i = 0; i < tmp.length; i++ ) {
                //         vm.homeData[index]['detail_new'][tmp[i].sort_weigh] = tmp;
                //     }
                // }
                return vm.homeData;
            });
        }

        vm.openCategory = function(catId){
            $state.go('products',{categoryId: catId});
        };

    }
})();