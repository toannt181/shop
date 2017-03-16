angular.module('gApp').config(config);

config.$inject = ['$stateProvider','$urlRouterProvider'];

function config($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
        .state('home', {
            url: '/home',
            views:{
                content:{
                    controller:'HomeController',
                    controllerAs:'ctrl',
                    templateUrl: 'templates/home/index.html'
                }
            }
        })
        .state('login', {
            url: '/login',
            views:{
                content:{
                    controller:'LoginController',
                    controllerAs: 'ctrl',
                    templateUrl: 'templates/login/login.html'
                }
            }
        });
} 
