(function (w, _) {
    'use strict';
    function CalendarEvent (obj, index) {
        var i = !isNaN(index) ? (index + 1) : '';
        var def = {
            start: 0,
            end: 0,
            overlappedWith: [],
            display: {},
            location: 'Sample Location ' + i,
            title: 'Sample Title ' + i,
            description: 'description ' + i
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
        if (!(_event instanceof CalendarEvent)) {
            return false;
        }
        if ((this.start >= _event.start && this.end <= _event.end) ||
            (this.start >= _event.start && this.start <= _event.end))
        {
            return true;
        }
        return false;
    };

    CalendarEvent.prototype.setDisplayAttr = function(obj) {
        this.display = _.defaults({
            top: this.start + 'px',
            height: this.getDuration() + 'px'
        }, obj);
    };

    CalendarEvent.prototype.getCssString = function() {
        var JSONStr;
        JSONStr = JSON.stringify(this.display);
        return JSONStr.substring(1, JSONStr.length - 1)
                .replace(/"/g, '').replace(/,/g, ';');
    };

    w.CalendarEvent = CalendarEvent;
})(window, window._);
