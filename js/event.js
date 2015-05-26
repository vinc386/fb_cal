(function (w, _) {
    'use strict';
    function CalendarEvent (obj) {
        var def = {
            start: 0,
            end: 0,
            overlappedWith: [],
            display: {},
            location: 'Sample Location',
            title: 'Sample Title',
            description: 'description',
            template: w.getTemplate('calEventTmpl')
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

    CalendarEvent.prototype.overlappedPriorEvents = function() {
        var self = this;
        return _.where(this.overlappedWith, function (_event) {
            return _event.start < self.start;
        });
    };

    CalendarEvent.prototype.getWidth = function() {
        return this.display.width;
    };

    CalendarEvent.prototype.setDisplayAttr = function(obj) {
        this.display = _.defaults({
            top: this.start,
            height: this.getDuration()
        }, obj);
    };

    CalendarEvent.prototype.getCssString = function() {
        var attrArr = ['height', 'top', 'width', 'left'];
        var JSONStr;

        JSONStr = JSON.stringify(_.mapObject(this.display, function (v, k) {
            if (_.contains(attrArr, k)) {
                return v + 'px';
            }
        }));

        return JSONStr.substring(1, JSONStr.length - 1)
                .replace(/"/g, '').replace(/,/g, ';');
    };

    w.CalendarEvent = CalendarEvent;
})(window, window._);
