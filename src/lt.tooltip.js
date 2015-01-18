;(function() {
'use strict';

angular.module('lt.tooltip', [])

.directive('tooltip', function() {
    return {
        restrict: 'AE',
        transclude: true,
        template: '<div class="tooltip"></div><span class="transcluded" ng-transclude></span>',
        link: function($scope, $el, $attrs) {
            var el = $el[0],
                rect = el.getBoundingClientRect(),
                template = $attrs.template || $attrs.content || 'This is a tooltip!',
                direction = $attrs.direction || 'top';

            var $tooltipEl = angular.element(el.querySelector('.tooltip')),
                $transcluded = angular.element(el.querySelector('.transcluded'));

            var transcludedHeight = $transcluded[0].offsetHeight,
                transcludedWidth = $transcluded[0].offsetWidth;

            var topCSS, leftCSS,
                width, height;

            var TOOLTIP_MARGIN = 10;

            $tooltipEl.html(template);
            width = $tooltipEl[0].offsetWidth;
            height = $tooltipEl[0].offsetHeight;

            topCSS = rect.top - (height + TOOLTIP_MARGIN) + 'px';
            leftCSS = rect.left - Math.abs(transcludedWidth - width)/2 + 'px';

            if (direction === 'right') {
                topCSS = rect.top - (transcludedHeight/2) + 'px';
                leftCSS = rect.left + (transcludedWidth + TOOLTIP_MARGIN) + 'px';
            } else if (direction === 'left') {
                topCSS = rect.top - (transcludedHeight/2) + 'px';
                leftCSS = rect.left - (width + TOOLTIP_MARGIN) + 'px';
            } else if (direction === 'bottom') {
                topCSS = rect.top + (height - TOOLTIP_MARGIN) + 'px';
                leftCSS = rect.left - Math.abs(transcludedWidth - width)/2 + 'px';
            }

            $tooltipEl.css('top', topCSS);
            $tooltipEl.css('left', leftCSS);

            el.addEventListener('mouseover', function() {
                $tooltipEl.addClass('show');
            });

            el.addEventListener('mouseout', function() {
                $tooltipEl.removeClass('show');
            });
            
            //@TODO - don't forget to destroy the event listeners
        }
    }
})


})();