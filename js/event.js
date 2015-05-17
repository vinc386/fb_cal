(function (w, _) {
    'use strict';
    function CalendarEvent (obj) {
        var def = {
            start: 0,
            end: 0,
            location: 'Sample Location',
            title: 'Sample Title'
        };
        _.extend(this, def, obj);
    }

    CalendarEvent.prototype.getDuration = function () {
        if (!this.duration) {
            this.duration = this.end - this.start;
        }
        return this.duration;
    };

    CalendarEvent.prototype.isOverlappedWith = function (_event) {
        if ((this.start <= _event.start && this.end >= _event.start) ||
            (this.start >= _event.start && this.start >= _event.end))
        {
            return true;
        }
        return false;
    };

    CalendarEvent.prototype.setPrevEvent = function (_event) {
        this.prevEvent = _event;
    };

    w.CalendarEvent = CalendarEvent;
})(window, window._);
