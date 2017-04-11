require('angular');
require('angular-ui-router');
require('angular-sanitize');
require('angular-ui-bootstrap');
require('satellizer');
require('ngstorage');
require('ng-infinite-scroll');
require('swiper');
require('angular-loading-bar');
require('angular-animate');
require('angular-touch');
require('angular-slick-carousel');

angular
    .module('gApp', [
        /* Shared modules */
        'gApp.core',
        'gApp.config',
        'gApp.services',

        /* Feature areas */
        'gApp.shared',
        'gApp.vnpayAuth',
        'gApp.home',
        'gApp.category',
        'gApp.deal',
        'gApp.food',
        'gApp.address',
        'gApp.cartConfirm',
        'gApp.cart',
        'gApp.done',
        'gApp.order',
        'gApp.collection',
        'gApp.notifications',
        'gApp.article',
        'gApp.login',
        'gApp.register',
    ]);

angular
    .module('gApp.core', [
        /* Angular modules */
        'ngSanitize',
        'ngStorage',

        /* Cross-app modules */
        'gApp.config',

        /* 3rd-party modules */
        'ui.router',
        'satellizer',
        'infinite-scroll',
        'angular-loading-bar'
    ]);

angular
    .module('gApp.services', []);

angular
    .module('gApp.shared', ['ui.bootstrap']);
    
angular
    .module('gApp.vnpayAuth', []);

angular
    .module('gApp.home', ['slickCarousel']);

angular
    .module('gApp.category', []);

angular
    .module('gApp.deal', []);

angular
    .module('gApp.food', []);

angular
    .module('gApp.address', []);

angular
    .module('gApp.cartConfirm', []);
    
angular
    .module('gApp.cart', []);

angular
    .module('gApp.done', []);

angular
    .module('gApp.order', []);

angular
    .module('gApp.collection', []);

angular
    .module('gApp.notifications', []);

angular
    .module('gApp.article', []);

angular
    .module('gApp.login', []);

angular
    .module('gApp.register', []);