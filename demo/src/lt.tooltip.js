;(function() {
'use strict';

angular.module('lt.tooltip', [])

.directive('tooltip', function() {

    //@TODO - Move this to config block
    var TOOLTIP_MARGIN = 10;
    var TOOLTIP_DEFAULT_TEXT = 'This is a tooltip!';
    var TOOLTIP_DEFAULT_DIRECTION = 'top';

    // Retrieve dimensions for the tooltip itself and the element it's being
    // applied to. Returns the dimensions as an object.
    var getDimensions = function ($element) {
        var el = $element[0],
            $tooltipEl = angular.element(el.querySelector('.tooltip')),
            $transcluded = angular.element(el.querySelector('.transcluded')),
            rect = el.getBoundingClientRect();

        return {
            top: rect.top,
            left: rect.left,
            tooltipHeight: $tooltipEl[0].offsetHeight,
            tooltipWidth: $tooltipEl[0].offsetWidth,
            transcludedHeight: $transcluded[0].offsetHeight,
            transcludedWidth: $transcluded[0].offsetWidth
        };
    };

    // Calculate the position of the tooltip. Returns the position as an object.
    var calculatePosition = function(dimensions, direction) {
        var top = dimensions.top,
            left = dimensions.left,
            height = dimensions.tooltipHeight,
            width = dimensions.tooltipWidth,
            transcludedHeight = dimensions.transcludedHeight,
            transcludedWidth = dimensions.transcludedWidth,
            topCSS,
            leftCSS;

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
                $tooltipEl = angular.element(el.querySelector('.tooltip')),
                direction = $attrs.direction || TOOLTIP_DEFAULT_DIRECTION,
                template = $attrs.template || $attrs.content || TOOLTIP_DEFAULT_TEXT,
                dimensions,
                position;

            // Make sure the template has been put in the DOM before retrieval
            // of dimensions. Otherwise, the dimensions will be reported
            // (incorrectly) without the content.
            $tooltipEl.html(template);

            dimensions = getDimensions($el),
            position = calculatePosition(dimensions, direction);

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
