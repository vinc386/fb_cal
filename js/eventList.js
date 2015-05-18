(function (w, CalendarEvent, _) {
    'use strict';
    var eventList;
    var totalWidth;

    function EventList (collection, wrapperWidth) {
        eventList = _.map(collection, instantiateEvent);
        totalWidth = wrapperWidth;
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
            checkOverlappedWithAllPreviousEvents(_event, null, index);
        });
    }

    function checkOverlappedWithAllPreviousEvents (_event, prevEvent, index) {
        var _prevEvent;
        _event.prevEvent = (index && index > 0) ? eventList[index - 1] : null;
        _prevEvent = prevEvent || _event.prevEvent;

        if (_prevEvent && _event.isOverlappedWith(_prevEvent)) {
            _event.overlappedWith.push(_prevEvent);
            _prevEvent.overlappedWith.push(_event);
            if(_prevEvent.prevEvent !== null) {
                checkOverlappedWithAllPreviousEvents(_event, _prevEvent.prevEvent, index);
            // } else {

            }
        }
    }

    function getOffsets (_event, index) {
        var overlappedArr = _event.overlappedWith;
        var _width;

        if (!overlappedArr.length) {
            _event.setDisplayAttr({
                left: '15px',
                width: totalWidth + 'px'
            });
        } else {
            _width = totalWidth / (overlappedArr.length + 1);
            console.log(_event.getAllPreviousOverlappedEvent());
            _event.setDisplayAttr({
                width: _width + 'px',
                left: 15 + _width * overlappedArr.length + 'px'
            });
            // overlappedArr.forEach(function (__event, _index) {
            // });
        }
        console.log(_event);
    }

    w.EventList = EventList;
})(window, window.CalendarEvent, window._);