;(function() {
'use strict';

angular.module('lt.tooltip', [])

.directive('tooltip', function() {
    var TOOLTIP_MARGIN = 10; //@TODO - Move this to config block

    var calculatePosition = function(dimensions, direction) {
        // Always default to top
        var top = dimensions.top,
            left = dimensions.left,
            height = dimensions.tooltipHeight,
            width = dimensions.tooltipWidth,
            transcludedHeight = dimensions.transcludedHeight,
            transcludedWidth = dimensions.transcludedWidth;

        var topCSS, leftCSS;
        switch (direction) {
            case 'right':
                topCSS = top - (transcludedHeight/2) + 'px';
                leftCSS = left + (transcludedWidth + TOOLTIP_MARGIN) + 'px';
                break;
            case 'left':
                topCSS = top - (transcludedHeight/2) + 'px';
                leftCSS = left - (width + TOOLTIP_MARGIN) + 'px';
                break;
            case 'bottom':
                topCSS = top + (height - TOOLTIP_MARGIN) + 'px';
                leftCSS = left - Math.abs(transcludedWidth - width)/2 + 'px';
                break;
            case 'top':
            default:
                topCSS = top - (height + TOOLTIP_MARGIN) + 'px',
                leftCSS = left - Math.abs(transcludedWidth - width)/2 + 'px';
        }

        return {
            top: topCSS,
            left: leftCSS
        }
    };

    return {
        restrict: 'AE',
        transclude: true,
        template: '<div class="tooltip"></div><span class="transcluded" ng-transclude></span>',
        link: function($scope, $el, $attrs) {
            var el = $el[0],
                rect = el.getBoundingClientRect(),
                $tooltipEl = angular.element(el.querySelector('.tooltip')),
                $transcluded = angular.element(el.querySelector('.transcluded'));

            //OPTIONS
            var template = $attrs.template || $attrs.content || 'This is a tooltip!',
                direction = $attrs.direction || 'top';

            //Make sure the template has been put in the DOM before retrieval of dimensions
            //Otherwise, the dimensions will be reported (incorrectly) without the content
            $tooltipEl.html(template);

            var dimensions = {
                top: rect.top,
                left: rect.left,
                tooltipHeight: $tooltipEl[0].offsetHeight,
                tooltipWidth: $tooltipEl[0].offsetWidth,
                transcludedHeight: $transcluded[0].offsetHeight,
                transcludedWidth: $transcluded[0].offsetWidth
            };

            var position = calculatePosition(dimensions, direction);

            $tooltipEl.css('top', position.top);
            $tooltipEl.css('left', position.left);

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