(function (w, $, _, EventList) {
    'use strict';
    var eventArr;
    var timestampTmpl = getTempl('#timestampTmpl');
    var timelineTmpl = getTempl('#timelineTmpl');
    var eventTmpl = getTempl('#calEventTmpl');

    w.layOutDay = function (events) {
        eventArr = new EventList(events);
        $('.timelineWrapper').html(renderTimeline(9, 21));
        $('.eventListWrapper').html(renderEvents(eventArr));
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

    function renderEvents (arr) {
        var output = '';
        arr.forEach(function (_event, index) {
            output += eventTmpl(_event);
            console.log(_event.title, _event.start, _event.end, _event.display, _event.leftCount,
                        'LEFT', _.result(_event.onLeft, 'title'), 'RIGHT', _.result(_event.onRight, 'title'));
        });
        return output;
    }

    $(document).ready(function () {
        // w.layOutDay([{start: 30, end: 150}, {start: 540, end: 600},
        // {start: 560, end: 620}, {start: 610, end: 670} ]);
        w.layOutDay([{ start: 30, end: 150 }, { start: 160, end: 200 }, { start: 180, end: 240 }, 
            { start: 190, end: 210 }, { start: 192, end: 198 }, { start: 220, end: 230 }, { start: 540, end: 600 },
            { start: 560, end: 620 }, { start: 610, end: 670 }]);
    });
})(window, window.jQuery, window._, window.EventList);