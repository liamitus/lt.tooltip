;(function() {
'use strict';

angular.module('lt.tooltip', [])

.directive('tooltip', function() {
    return {
        restrict: 'AE',
        transclude: true,
        template: '<div class="tooltip"></div><div ng-transclude></div>',
        link: function($scope, $el, $attrs) {
            var el = $el[0],
                $tooltipEl = angular.element(el.querySelector('.tooltip')),
                template = $attrs.template || $attrs.content || 'This is a tooltip!';

            $tooltipEl.html(template);

            el.addEventListener('mouseover', function() {
                $tooltipEl.css('display', 'block');
            });

            el.addEventListener('mouseout', function() {
                $tooltipEl.css('display', 'none');
            });
            
            //@TODO - don't forget to destroy the event listeners
        }
    }
})


})();