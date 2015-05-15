(function (w, $, _) {
    'use strict';
    var eventArr = [{start: 30, end: 150}, {start: 540, end: 600},
        {start: 560, end: 620}, {start: 610, end: 670} ];
    var timestampTmpl = _.template('<div class="row"> <span class="text-primary"><%= data.label %></span> <span class="text-muted"><%= data.ampm %></span> </div>', {variable: 'data'});
    var timelineTmpl = _.template('<div class="timeline col-md-1"><%= data.rows %></div>', {variable: 'data'});

    w.layOutDay = function (events) {
        console.log('blah', events);
    };

    function generateTimeStamps (start, end) {
        var arr = [];
        var i = start;
        var timeBase;
        var oClock;
        var halfClock

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
        $('.timelineWrapper').html(renderTimeline(9, 21));
        w.layOutDay(eventArr);
    });
})(window, window.jQuery, window._);