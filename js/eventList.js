(function (w, CalendarEvent, _) {
    'use strict';
    var totalWidth = 590;
    var leftBorder = 15;

    function EventList (collection) {
        this.list = _.sortBy(_.map(collection, instantiateEvent), 'start');
        this.getOverlappedEventCount();
        this.list.forEach(getTileOffset);
        this.template = w.getTemplate('eventListWrapperTmpl');
    }

    EventList.prototype.render = function() {
        var htmlStr = '';

        this.list.map(function (_event) {
            htmlStr +=  _event.template(_event);
        });
        return this.template(htmlStr);
    };

    EventList.prototype.getOverlappedEventCount = function() {
        var self = this;
        this.list.forEach(function (_event, index) {
            var overlapped = checkOverlap(_event, self.getPrevEvent(_event));
        });
    };

    EventList.prototype.getPrevEvent = function (_event) {
        var index = this.list.indexOf(_event);
        if (index > 0) {
            return this.list[index - 1];
        } else if (index === 0) {
            return this.list[this.list.length - 1];
        } else {
            return false;
        }
    };

    function instantiateEvent (obj, index) {
        return new CalendarEvent(obj, index);
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

    function getTileOffset (_event, index) {
        var displayObj = {};
        var lCount = getOnLeftEventCount(_event);
        var W;

        if (_event.onLeft === undefined && _event.onRight === undefined) {
            displayObj.width = totalWidth;
            displayObj.left = leftBorder;
        } else if (_event.onLeft && !_event.onRight) {
            W = totalWidth / lCount;
            displayObj.width = W;
            displayObj.left = leftBorder + W * (lCount - 1);
            resetWidthAndLeft(_event, W);
        } else if (!_event.onLeft && _event.onRight) {
            displayObj.width = _event.onRight.getWidth();
            displayObj.left = leftBorder;
        }

        return _event.setDisplayAttr(displayObj);
    }

    function resetWidthAndLeft (_event, W) {
        if (_event.onLeft) {
            _event.onLeft.setDisplayAttr({
                width: W,
                left: leftBorder + ((getOnLeftEventCount(_event.onLeft) - 1) * W)
            });
            resetWidthAndLeft(_event.onLeft, W);
        }
    } 

    function getOnLeftEventCount (_event, count) {
        var _count = count || 1;

        if (_event.onLeft) {
            _count += 1;
            return getOnLeftEventCount(_event.onLeft, _count);
        }
        return _count;
    }

    w.EventList = EventList;
})(window, window.CalendarEvent, window._);