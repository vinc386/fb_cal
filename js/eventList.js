(function (w, CalendarEvent, _) {
    'use strict';
    function EventList (collection) {
        var sortedList = _.sortBy(collection, 'start');
        return _.extend([], this, _.map(sortedList, instantiateEvent));
    }

    function instantiateEvent (obj) {
        return new CalendarEvent(obj);
    }

    EventList.prototype.setPrevEvent = function() {
        return _.map(this, function (_event, index) {
            if (index > 0) {
                _event.setPrevEvent(this[index - 1]);
            } else if (index === 0) {
                _event.setPrevEvent(null);
            }
            return _event;
        });
    };

    EventList.prototype.getOverlappedEventCount = function() {
        this.forEach(function (_event, index) {
            w.console.log(_event, index);
        });
    };

    w.EventList = EventList;
})(window, window.CalendarEvent, window._);