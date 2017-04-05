
angular
    .module('gApp.core').directive('setClassFixTop',setClassFixTop);

    setClassFixTop.$inject = ['$window','$timeout', '$rootScope', '$state', '$localStorage'];

function setClassFixTop($window, $timeout, $rootScope, $state, $localStorage){
    var $win = angular.element($window); // wrap window object as jQuery object

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var topClass = attrs.setClassFixTop; // get CSS class from directive's attribute value
            var offsetTop = ($localStorage.filterOffsetTop > 0 ?  $localStorage.filterOffsetTop : element.offset().top);
            var update = function() {
                if($localStorage.filterOffsetTop === 0 && offsetTop < element.offset().top){
                    offsetTop = element.offset().top;
                    $timeout(update, 500);
                }else{
                    if($state.current.name === 'productsList'){
                        $localStorage.filterOffsetTop = offsetTop;

                        $win.on('scroll', function (e) {
                            if ($win.scrollTop() >= offsetTop) {
                                element.addClass(topClass);
                            } else {
                                element.removeClass(topClass);
                            }
                        });
                    }
                }
            };            

            $timeout(update, 500);

        }
    };
}
/**
 * Created by tranlinh on 27/9/2016.
 */


