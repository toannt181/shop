angular
    .module('gApp')
    .config(config);

config.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider', '$authProvider', 'env'];

function config($httpProvider, $stateProvider, $urlRouterProvider, $authProvider, env) {
    $urlRouterProvider
        .otherwise('/404') // any unknown URLS go to 404
        .when('', '/'); // no route goes to index

    var theme = "theme-v2";

    var footer = {
        controller: 'FooterController',
        controllerAs: 'footerCtrl',
        templateUrl: '/templates/' + theme + '/partials/footer.html'
    };

    var header = {
        controller: 'HeaderController',
        controllerAs: 'headerCtrl',
        templateUrl: '/templates/' + theme + '/partials/header.html'
    };

    // var cart_right = {
    //     controller: 'CartController',
    //     controllerAs: 'cartCtrl',
    //     templateUrl: '/templates/' + theme + '/partials/cart-right.html'
    // };
	
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
                    templateUrl: '/templates/' + theme + '/home/index.html'
                },
                'footer': footer,
                'header': header
            }
        })
        // .state('cart', {
        //     url: '/cart',
        //     views: {
        //         content: {
        //             controller: 'CartController',
        //             controllerAs: 'ctrl',
        //             templateUrl: '/templates/' + theme + '/cart/index.html'
        //         },
        //         'footer': footer,
        //         'header': header
        //     }
        // })
        // .state('cartConfirm', {
        //     url: '/cart/confirm/:paymentMethod',
        //     views: {
        //         'content': {
        //             controller: 'CartConfirmController',
        //             controllerAs: 'ctrl',
        //             templateUrl: '/templates/' + theme + '/cart/confirm.html'
        //         },
        //         'footer': footer,
        //         'header': header
        //     }
        // })
        .state('productsDetail', {
            url: '/products/:productId',
            views: {
                content: {
                    controller: 'ProductsDetailController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/' + theme + '/products/product_detail.html'
                },
                'footer': footer,
                'header': header
            }
        })
        // .state('productSearches', {
        //     url: '/search?categoryId&name&brandId&offset&limit&ratePrice',
        //     views: {
        //         content: {
        //             controller: 'ProductSearchesController',
        //             controllerAs: 'ctrl',
        //             templateUrl: '/templates/' + theme + '/products/search.html'
        //         },
        //         'footer': footer,
        //         'header': header,
        //         'cart_right@productSearches':cart_right
        //     }
        // })
        // .state('products', {
        //     url: '/products?categoryId&brandId&sort&offset&limit&ratePrice',
        //     views: {
        //         content: {
        //             controller: 'ProductController',
        //             controllerAs: 'ctrl',
        //             templateUrl: '/templates/' + theme + '/products/index.html',
        //         },
        //         'cart_right@products': cart_right,
        //         'footer': footer,
        //         'header': header
        //     }
        // })
        // .state('deals', {
        //     url: '/deals?categoryId&brandId&sort&offset&limit&ratePrice',
        //     views: {
        //         content: {
        //             controller: 'DealController',
        //             controllerAs: 'ctrl',
        //             templateUrl: '/templates/' + theme + '/products/deal.html'
        //         },
        //         'footer': footer,
        //         'header': header
        //     }
        // })
        // .state('foods', {
        //     url: '/foods?categoryId&brandId&sort&offset&limit&ratePrice',
        //     views: {
        //         content: {
        //             controller: 'FoodController',
        //             controllerAs: 'ctrl',
        //             templateUrl: '/templates/' + theme + '/products/food.html'
        //         },
        //         'footer': footer,
        //         'header': header
        //     }
        // })
        .state('login', {
            url: '/login',
            views: {
                content: {
                    controller: 'LoginController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/' + theme + '/account/login.html'
                },
                'footer': footer,
                'header': header
            }
        })
        .state('signin', {
            url: '/signin',
            views: {
                content: {
                    controller: 'RegisterController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/' + theme + '/account/signin.html'
                },
                'footer': footer,
                'header': header
            }
        })
        .state('forgotPassword', {
            url: '/forgotPassword',
            views: {
                content: {
                    controller: 'ForgotController',
                    controllerAs: 'ctrl',
                    templateUrl: '/templates/' + theme + '/account/forgotPassword.html'
                },
                'footer': footer,
                'header': header
            }
        })
        .state('401', {
            url: '/401',
            views: {
                'content': {
                    templateUrl: '/templates/' + theme + '/errors/401.html'
                },
                'footer': footer,
                'header': header
            }
        })
        .state('404', {
            url: '/404',
            views: {
                'content': {
                    templateUrl: '/templates/' + theme + '/errors/404.html'
                },
                'footer': footer,
                'header': header
            }
        })
        ;

    $authProvider.facebook({
        clientId: "366421220424953", // Test Client ID
        url: env.API_URL +'/v2/auth/facebook'
    });

    $authProvider.google({
        clientId: "904538658845-9vnuv4194l0egib181h2r5s8ltji7a19.apps.googleusercontent.com",
        url: env.API_URL +'/v2/auth/google'
    });

    $authProvider.loginUrl = env.API_URL + '/v2/auth/vnpay/login';
}
