angular
    .module('gApp')
    .factory('APIInterceptor', APIInterceptor)
    .config(config);

APIInterceptor.$inject = ['$q', '$injector', '$window'];

function APIInterceptor($q, $injector, $window) {
    return {
        'request': function (config) {
            config.headers = config.headers || {};

            var localStorageService = $injector.get('$localStorage');

            if (localStorageService.token) {
                config.headers.Authorization = 'Bearer ' + localStorageService.token;
            }
           
            return config;
        },
        'responseError': function (response) {
            var stateService = $injector.get('$state');

            if (response.status === 400 || response.status === 401 || response.status === 403) {
                // stateService.go('401', {});
                $window.location.href = '/vnpayshop/backapp';
            }

            if (response.status === 404) {
                stateService.go('404', {});
            }

            return $q.reject(response);
        }
    };
}

config.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider', '$authProvider', 'env'];

function config($httpProvider, $stateProvider, $urlRouterProvider, $authProvider, env) {
    $urlRouterProvider
        .otherwise('/404') // any unknown URLS go to 404
        .when('', '/'); // no route goes to index

    var footer = {
        controller: 'FooterController',
        controllerAs: 'footerCtrl',
        templateUrl: '/templates/partials/footer.html'
    };

    var header = {
        controller: 'HeaderController',
        controllerAs: 'headerCtrl',
        templateUrl: '/templates/partials/header.html'
    };

    // use a state provider for routing
    $stateProvider
        .state('auth', {
            url: '/auth/vnpay/login?data&signature&backurl',
            views: {
                content: {
                    controller: 'VnpayAuthController',
                    controllerAs: 'ctrl'
                }
            }
        })
        .state('home', {
            url: '/',
            views: {
                content: {
                    controller: 'HomeController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/home/index.html'
                },
                'footer': footer,
                'header': header
            }
        })
        .state('401', {
            url: '/401',
            views: {
                'content': {
                    templateUrl: '/templates/errors/401.html'
                }
            }
        })
        .state('404', {
            url: '/404',
            views: {
                'content': {
                    templateUrl: '/templates/errors/404.html'
                }
            }
        });

    $authProvider.loginUrl = env.API_URL + '/v1/auth/vnpay/login';

    // $httpProvider.interceptors.push('APIInterceptor');
}
