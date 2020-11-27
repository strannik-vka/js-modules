'use strict';

window.selectize_ajax = {

    init: function () {
        $('[selectize-ajax]').each(function () {
            selectize_ajax.selectize($(this));
        });
    },

    selectize: function (elem) {
        var valueField = elem.attr('value-field') ? elem.attr('value-field') : 'id',
            labelField = elem.attr('label-field') ? elem.attr('label-field') : 'name',
            searchParam = elem.attr('search-param') ? elem.attr('search-param') : 'name',
            searchField = elem.attr('search-field') ? elem.attr('search-field').split(',') : ['name'],
            url = elem.attr('selectize-ajax');

        elem.selectize({
            valueField: valueField,
            labelField: labelField,
            searchField: searchField,
            create: function (query, callbaсk) {
                var obj = {
                    url: url
                };

                obj[searchParam] = query;
                
                selectize_ajax.search(obj, callbaсk);
            },
            load: function (query, callbaсk) {
                var obj = {
                    url: url
                };
                
                obj[searchParam] = query;
                
                selectize_ajax.search(obj, callbaсk);
            },
            render: {
                option: function (item, escape) {
                    return '<div class="option">' + escape(item.name) + (item.email ? ', ' + item.email : '') + '</div>';
                }
            }
        });
    },

    timeOut: false,
    search: function (obj, callbaсk) {
        if (selectize_ajax.timeOut) clearTimeout(selectize_ajax.timeOut);
        selectize_ajax.timeOut = setTimeout(function () {
            obj._token = csrf_token;
            $.get(obj.url, obj, function (json) {
                callbaсk(json.data);
            }, 'json').fail(function () {
                callbaсk(false);
            });
        }, 800);
    }

}

$(selectize_ajax.init);