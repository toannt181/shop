/**
 * Created by Tran Linh on 1/24/2017.
 */
angular
    .module('gApp.core').filter('unicodeSort',unicodeSort);

function unicodeSort() {
    return function (items, field) {
        items.sort(function (a, b) {
            return a[field].localeCompare(b[field]);
        });
        return items;
    };
}