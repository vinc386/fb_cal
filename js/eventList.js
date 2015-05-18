(function (w, CalendarEvent, _) {
    'use strict';
    var eventList;

    function EventList (collection) {
        eventList = _.map(collection, instantiateEvent);
        _.sortBy(eventList, 'start');
        getOverlappedEventCount();
        return _.extend([], this, eventList);
    }

    function instantiateEvent (obj, index) {
        return new CalendarEvent(obj, index);
    }

    function getOverlappedEventCount() {
        eventList.forEach(function (_event, index) {
            checkOverlappedWithAllPreviousEvents(_event, null, index);
            w.console.log(_event);
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

    w.EventList = EventList;
})(window, window.CalendarEvent, window._);