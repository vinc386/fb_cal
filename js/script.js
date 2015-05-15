(function (w, $, _) {
    'use strict';
    var eventArr = [{start: 30, end: 150}, {start: 540, end: 600},
        {start: 560, end: 620}, {start: 610, end: 670} ];
    var timestampTmpl = _.template('<div class="row"> <span class="text-primary"><%= data.label %></span> <span class="text-muted"><%= data.ampm %></span> </div>', {variable: 'data'});
    var timelineTmpl = _.template('<div class="timeline col-md-1"><%= data.rows %></div>', {variable: 'data'});

    w.layOutDay = function (events) {
        console.log('blah', eventArr);
    };

    function generateTimeStamps (start, end) {
        var arr = [];
        var i = start;
        var oClock;
        var halfClock

        for (i; i <= end; i += 1) {
            oClock = {
                hour: (i <= 12) ? i : i - 12,
                ampm: (i > 0 && i < 12) ? 'AM' : 'PM',
                minute: '00'
            };
            halfClock = {
                hour: (i <= 12) ? i : i - 12,
                minute: '30',
                ampm: ''
            };

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
            console.log(label);
            if (!stamp.ampm) {
                output += timestampTmpl({label: '', ampm: label});
            } else {
                output += timestampTmpl({label: label, ampm: stamp.ampm});
            }
        });

        return timelineTmpl({rows: output});
    }

    $(document).ready(function () {
        $('.timelineWrapper').html(_.compose(generateTimeStampRows, generateTimeStamps)(9, 21));
        w.layOutDay();
    });
})(window, window.jQuery, window._);