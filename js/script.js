(function (w, $, _, EventList) {
    'use strict';
    var eventArr;
    var timestampTmpl = getTempl('#timestampTmpl');
    var timelineTmpl = getTempl('#timelineTmpl');

    w.layOutDay = function (events) {
        eventArr = new EventList(events);
        $('.timelineWrapper').html(renderTimeline(9, 21));
        eventArr.getOverlappedEventCount();
        w.console.log('blah', events);
    };

    function getTempl (selector) {
        return _.template($(selector).html(), {variable: 'data'});
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
})(window, window.jQuery, window._, window.EventList);