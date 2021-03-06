;(function() {
'use strict';

angular.module('lt.tooltip', [])

.directive('tooltip', ['$window', function($window) {

    //@TODO - Move this to config block
    var TOOLTIP_MARGIN = 10;
    var TOOLTIP_DEFAULT_TEXT = 'This is a tooltip!';
    var TOOLTIP_DEFAULT_DIRECTION = 'top';
    var DEFAULT_DIRECTION_PRIORITY = [
        'top',
        'bottom',
        'right',
        'left'
    ];

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
            transcludedWidth: $transcluded[0].offsetWidth,
            windowHeight: $window.innerHeight,
            windowWidth: $window.innerWidth
        };
    };

    // Determine from the given position and dimensions if the tooltip will
    // end up completely within the window (and be visible).
    // Returns true if the tooltip will be visible, false otherwise.
    var isWithinVisibleArea = function (position, dimensions) {
        var top = position.top,
            right = position.left + dimensions.tooltipWidth,
            bottom = position.top + dimensions.tooltipHeight,
            left = position.left;

        return top >= 0 && left >= 0 &&
            right < $window.innerWidth && bottom < $window.innerHeight;
    };

    // Removes a given direction from the given array of directions.
    // Returns the updated array.
    var removeDirection = function (direction, directions) {
        var index = directions.indexOf(direction);
        if (index > 0) {
            directions.splice(index, 1);
        }
        return directions;
    };

    // Retrieve the next direction in the priority list, as a string.
    // If the given direction is not found, then the first direction in the
    // array of directin priorities will be returned.
    var nextDirection = function (direction, directionPriorities) {
        var directions = directionPriorities || DEFAULT_DIRECTION_PRIORITY,
            index = directions.indexOf(direction);
        ++index;
        if (index >= directions.length) {
            index = 0;
        }
        return directions[index];
    };

    // Calculate the position of the tooltip, repositions if out of the window.
    // Returns the position as an object.
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
                topCSS = top - (transcludedHeight/2);
                leftCSS = left + (transcludedWidth + TOOLTIP_MARGIN);
                break;
            case 'left':
                topCSS = top - (transcludedHeight/2);
                leftCSS = left - (width + TOOLTIP_MARGIN);
                break;
            case 'bottom':
                topCSS = top + (height - TOOLTIP_MARGIN);
                leftCSS = left - Math.abs(transcludedWidth - width)/2;
                break;
            case 'top':
            default:
                topCSS = top - (height + TOOLTIP_MARGIN),
                leftCSS = left - Math.abs(transcludedWidth - width)/2;
        }

        return {
            top: topCSS,
            left: leftCSS
        }
    };

    var positionArrow = function($tooltipArrow, direction) {
        var arrowPlacement;

	// The arrow placement is dependant on the direction of the tooltip
        switch (direction) {
            case 'right':
                arrowPlacement = 'left';
                break;
            case 'left':
                arrowPlacement = 'right';
                break;
            case 'bottom':
                arrowPlacement = 'top';
                break;
            case 'top':
            default:
                arrowPlacement = 'bottom';
        }

        $tooltipArrow.addClass(arrowPlacement);
    }

    return {
        restrict: 'AE',
        transclude: true,
        template: function(tElement, tAttrs) {
            return '<div class="tooltip">' +
                        '<div class="tooltip-content"></div>' +
                        '<div class="tooltip-arrow"></div>' +
                    '</div>' +
                    '<span class="transcluded" ng-transclude></span>';
        },
        link: function($scope, $el, $attrs) {
            var el = $el[0],
                $tooltipEl = angular.element(el.querySelector('.tooltip')),
                $tooltipContent = angular.element(el.querySelector('.tooltip-content')),
                $tooltipArrow = angular.element(el.querySelector('.tooltip-arrow')),
                direction = $attrs.direction || TOOLTIP_DEFAULT_DIRECTION,
                template = $attrs.template || $attrs.content || TOOLTIP_DEFAULT_TEXT,
                directions = DEFAULT_DIRECTION_PRIORITY,
                dimensions,
                position,
                withinVisibleArea;

            // Make sure the template has been put in the DOM before retrieval
            // of dimensions. Otherwise, the dimensions will be reported
            // (incorrectly) without the content.
            $tooltipContent.html(template);

            dimensions = getDimensions($el),
            position = calculatePosition(dimensions, direction);
            withinVisibleArea = isWithinVisibleArea(position, dimensions);

            // Recalculate until tooltip is within visible area.
            while (!withinVisibleArea && directions.length) {
                directions = removeDirection(direction, directions);
                direction = nextDirection(direction, directions);
                position = calculatePosition(dimensions, direction);
                withinVisibleArea = isWithinVisibleArea(position, dimensions);
            }

            $tooltipEl.css('top', position.top + 'px');
            $tooltipEl.css('left', position.left + 'px');

            positionArrow($tooltipArrow, direction);

            el.addEventListener('mouseover', function() {
                $tooltipEl.addClass('show');
            });

            el.addEventListener('mouseout', function() {
                $tooltipEl.removeClass('show');
            });
            
            //@TODO - don't forget to destroy the event listeners
        }
    }
}])

})();
