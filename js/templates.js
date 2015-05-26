(function (w) {
    var _templates = {};

    _templates.eventListWrapperTmpl = '<div class="eventListWrapper col-md-4"><%= data %></div>';
    _templates.timelineWrapper = '<div class="timelineWrapper col-md-1"><%= data %></div>';

    _templates.timestampTmpl = 
    '<div class="row timestamp-row">' + 
        '<span class="text-primary timestamp-label"><%= data.label %></span>' +
        '<span class="text-muted ampm-label"><%= data.ampm %></span>' +
    '</div>';
    _templates.timelineTmpl = '<div class="timeline"><%= data.rows %></div>';

    _templates.calEventTmpl = 
    '<div class="eventTile" style="<%= data.getCssString() %>">' +
        '<h5 class="text-primary"><%= data.title %></h5>' +
        '<h5 class="text-muted"><small><%= data.location %></small></h5>' +
        '<h6 class="text-muted"><small><%= data.description %></small></h6>' +
    '</div>';

    w.getTemplate = function (name) {
        return _.template(_templates[name], {variable: 'data'});
    };
})(window);
