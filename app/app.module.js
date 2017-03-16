require('angular');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('angular-animate');
require('angular-touch');

angular
    .module('gApp', [
        'gApp.home',
        'gApp.login',
        'ui.router'
    ]);

angular
    .module('gApp.home', ['ui.bootstrap']);

angular
    .module('gApp.login', []);
