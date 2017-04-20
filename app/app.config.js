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

    var cart_right = {
        templateUrl: '/templates/partials/cart-right.html'
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
        .state('cart', {
            url: '/cart',
            views: {
                content: {
                    controller: 'CartController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/cart/index.html'
                },
                'footer': footer,
                'header': header
            }
        })
        .state('cartConfirm', {
            url: '/cart/confirm/:paymentMethod',
            views: {
                'content': {
                    controller: 'CartConfirmController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/cart/confirm.html'
                },
                'footer': footer,
                'header': header
            }
        })
        .state('productsDetail', {
            url: '/products/:productId',
            views: {
                content: {
                    controller: 'ProductsDetailController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/products/detail.html'
                },
                'footer': footer,
                'header': header,
                'cart_right@productsDetail': cart_right
            }
        })
        .state('productSearches', {
            url: '/search?categoryId&name&brandId&offset&limit&ratePrice',
            views: {
                content: {
                    controller: 'ProductSearchesController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/products/search.html'
                },
                'footer': footer,
                'header': header,
                'cart_right@productSearches':cart_right
            }
        })
        .state('products', {
            url: '/products?categoryId&brandId&sort&offset&limit&ratePrice',
            views: {
                content: {
                    controller: 'ProductController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/products/index.html',
                },
                'cart_right@products': cart_right,
                'footer': footer,
                'header': header
            }
        })
        .state('deals', {
            url: '/deals?categoryId&brandId&sort&offset&limit&ratePrice',
            views: {
                content: {
                    controller: 'DealController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/products/deal.html'
                },
                'footer': footer,
                'header': header
            }
        })
        .state('foods', {
            url: '/foods?categoryId&brandId&sort&offset&limit&ratePrice',
            views: {
                content: {
                    controller: 'FoodController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/products/food.html'
                },
                'footer': footer,
                'header': header
            }
        })
        .state('login', {
            url: '/login',
            views: {
                content: {
                    controller: 'LoginController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/login/login.html'
                },
                'footer': footer
                // 'header': header
            }
        })
        .state('register', {
            url: '/register',
            views: {
                content: {
                    controller: 'RegisterController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/login/register.html'
                },
                'footer': footer
                // 'header': header
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

    $authProvider.facebook({
        clientId: "366421220424953", // Test Client ID
        url: env.API_URL +'/v2/auth/facebook'
    });

    $authProvider.google({
        clientId: "904538658845-9vnuv4194l0egib181h2r5s8ltji7a19.apps.googleusercontent.com",
        url: env.API_URL +'/v2/auth/google'
    });

    $authProvider.loginUrl = env.API_URL + '/v2/auth/vnpay/login';

    // $httpProvider.interceptors.push('APIInterceptor');
}
