(function (w, CalendarEvent, _) {
    'use strict';
    var eventList;

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
        return _event.setDisplayAttr();
        // _event.setDisplayAttr({
        //     left: '15px',
        //     width: totalWidth + 'px'
        // });
    }

    w.EventList = EventList;
})(window, window.CalendarEvent, window._);