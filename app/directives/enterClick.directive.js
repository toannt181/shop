
angular
    .module('gApp.core').directive('enterClick',enterClick);

function enterClick(){
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            var keyCode = event.which || event.keyCode;
            if(keyCode === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.enterClick);
                });

                event.preventDefault();
            }
        });
    };
}