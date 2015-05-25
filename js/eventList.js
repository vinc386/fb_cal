(function (w, CalendarEvent, _) {
    'use strict';
    var eventList;
    var totalWidth = 590;

    function EventList (collection) {
        eventList = _.map(collection, instantiateEvent);
        _.sortBy(eventList, 'start');
        getOverlappedEventCount();
        eventList.forEach(getOffsets);
        return _.extend([], this, eventList);
    }


    function instantiateEvent (obj, index) {
        return new CalendarEvent(obj, index);
    }

    function getOverlappedEventCount() {
        eventList.forEach(function (_event, index) {
            var overlapped = checkOverlap(_event, getPrevEvent(_event));
        });
    }

    function getPrevEvent(_event) {
        var index = eventList.indexOf(_event);
        if (index > 0) {
            return eventList[index - 1];
        } else if (index === 0) {
            return eventList[eventList.length - 1];
        } else {
            return false;
        }
    }

    function checkOverlap(_event, prevEvent) {
        var result = {};
        var temp;

        if (_event.isOverlappedWith(prevEvent)) {
            result._left = prevEvent;
            prevEvent.overlappedWith.push(_event);
            _event.overlappedWith.push(prevEvent);

            if(prevEvent.onLeft) {
                if (!_event.isOverlappedWith(prevEvent.onLeft)) {
                    temp = checkOverlap(_event, prevEvent.onLeft);
                    result._left = temp._left;
                    result._right = prevEvent.onLeft.onLeft ? temp._right : prevEvent;
                } else {
                    _event.overlappedWith.push(prevEvent.onLeft);
                    prevEvent.onLeft.overlappedWith.push(_event);
                }
            }
        } else {
            if (prevEvent.onLeft) {
                temp = checkOverlap(_event, prevEvent.onLeft);
                result._left = temp._left;
                result._right = temp._right;
            }
        }

        _event.onRight = result._right;
        _event.onLeft = result._left;
        return result;
    }

    function getOffsets (_event, index) {
        var displayObj = {};
        var lCount = getLeftCount(_event);
        var W;

        if (_event.onLeft === undefined && _event.onRight === undefined) {
            displayObj.width = totalWidth + 'px';
            displayObj.left = 15 + 'px';
        } else if (_event.onLeft && !_event.onRight) {
            W = totalWidth / lCount;
            displayObj.width = W + 'px';
            displayObj.left = 15 + W * (lCount - 1) + 'px';
            resetWidthAndLeft(_event, W);
        } else if (!_event.onLeft && _event.onRight) {
            displayObj.width = _event.onRight.getWidth();
            displayObj.left = 15 + 'px';
        }

        return _event.setDisplayAttr(displayObj);
    }

    function resetWidthAndLeft (_event, W) {
        if (_event.onLeft) {
            _event.onLeft.setDisplayAttr({
                width: W + 'px',
                left: 15 + ((getLeftCount(_event) - 2) * W) + 'px'
            });

            if (_event.onLeft) {
                resetWidthAndLeft(_event.onLeft, W);
            }
        }
    } 

    function getLeftCount (_event, count) {
        var _count = count || 1;

        if (_event.onLeft) {
            _count += 1;
            return getLeftCount(_event.onLeft, _count);
        }
        return _count;
    }

    w.EventList = EventList;
})(window, window.CalendarEvent, window._);