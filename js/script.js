(function (w, $, _) {
    'use strict';
    var eventArr;
    var timestampTmpl = getTempl('#timestampTmpl');
    var timelineTmpl = getTempl('#timelineTmpl');

    w.layOutDay = function (events) {
        eventArr = _.map(setPrevEvent(events), getEventDuration);
        $('.timelineWrapper').html(renderTimeline(9, 21));
        getOverlappedEventCount(eventArr);
        w.console.log('blah', events);
    };

    function getTempl (selector) {
        return _.template($(selector).html(), {variable: 'data'});
    }

    function getEventDuration (e) {
        return _.defaults({}, e, {duration: e.end - e.start});
    }

    function isOverlapped (e1, e2) {
        if ((e1.start <= e2.start && e1.end >= e2.start) ||
            (e1.start >= e2.start && e1.start >= e2.end))
        {
            return true;
        }
        return false;
    }

    function setPrevEvent (eventList) {
        var list = _.sortBy(eventList, 'start');

        return _.map(list, function (e, index) {
            if (index > 0) {
                e.prevEvent = eventList[index - 1];
            } else if (index === 0) {
                e.prevEvent = null;
            }
            return e;
        });
    }

    function getOverlappedEventCount (eventList) {
        eventList.forEach(function (e, i) {
            e.overlap = e.overlap || 0;
            // if (isOverlapped(e, e.prevEvent)) {
            //     e.overlap += 1;
            // }
        });
        w.console.log(eventList);
    }

    function generateTimeStamps (start, end) {
        var arr = [];
        var i = start;
        var timeBase;
        var oClock;
        var halfClock;

        for (i; i <= end; i += 1) {
            timeBase = {
                hour: (i <= 12) ? i : i - 12,
                minute: '00',
                ampm: ''
            };
            oClock = _.defaults({
                ampm: (i > 0 && i < 12) ? 'AM' : 'PM'
            }, timeBase);
            halfClock = _.defaults({
                minute: '30'
            }, timeBase);

            if (i !== end) {
                arr.push(oClock, halfClock);
            } else {
                arr.push(oClock);
            }

            oClock = {};
            halfClock = {};
        }

        return arr;
    }

    function generateTimeStampRows (timestampArray) {
        var output = '';
        var label;

        timestampArray.forEach(function (stamp) {
            label = [stamp.hour, ':', stamp.minute].join('');

            if (!stamp.ampm) {
                output += timestampTmpl({label: '', ampm: label});
            } else {
                output += timestampTmpl({label: label, ampm: stamp.ampm});
            }
        });

        return timelineTmpl({rows: output});
    }

    function renderTimeline (start, end) {
        return _.compose(generateTimeStampRows, generateTimeStamps)(start, end);
    }

    $(document).ready(function () {
        w.layOutDay([{start: 30, end: 150}, {start: 540, end: 600},
        {start: 560, end: 620}, {start: 610, end: 670} ]);
    });
})(window, window.jQuery, window._);