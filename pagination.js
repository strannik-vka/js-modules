window.pagination = {

    model: {
        set: function (model, elem) {
            if (typeof elem === 'object') {
                var data = pagination.model.data(elem);
                if (typeof model === 'object') {
                    model = Object.assign(model, data);
                }
            }

            if (typeof pagination.model[model.name] === 'undefined') {
                $(document).on('click', '[filter-event="' + model.name + '"]', function () {
                    var name = pagination.model.name($(this)),
                        model = pagination.model.get(name);
                    model.page = 1;
                    pagination.load(model, function (json) {
                        pagination.print(model, json);
                    });
                });
            }

            pagination.model[model.name] = model;

            return model;
        },
        name: function (elem) {
            return elem.attr('page-prev') ? elem.attr('page-prev') : (elem.attr('page-next') ? elem.attr('page-next') : (elem.attr('page-model') ? elem.attr('page-model') : elem.attr('filter-event')));
        },
        data: function (elem) {
            var data = {};

            if (typeof elem === 'object') {
                var name = pagination.model.name(elem),
                    parent = $('[page-model="' + name + '"]');

                data = {
                    page: parseInt(parent.attr('page-current-page') ? parent.attr('page-current-page') : ($('[' + name + '-current-page]').length ? $('[' + name + '-current-page]').html() : 1)),
                    name: name,
                    last_page: parseInt(parent.attr('page-last-page') ? parent.attr('page-last-page') : $('[' + name + '-last-page]').html()),
                    count: parseInt(parent.attr('page-count') ? parent.attr('page-count') : $('[' + name + '-count]').html()),
                    url: parent.attr('page-url') ? parent.attr('page-url') : location.href,
                    replace: parent.attr('page-replace') ? (parent.attr('page-replace') == 'false' ? false : true) : true,
                    method: parent.attr('page-method') ? parent.attr('page-method') : 'append',
                    selector: {
                        list: parent.attr('page-list') ? parent.attr('page-list') : '[page-model="' + name + '"]',
                        item: parent.attr('page-item') ? parent.attr('page-item') : '[' + name + '-item]',
                        current_page: parent.attr('page-current-page') ? parent.attr('page-current-page') : '[' + name + '-current-page]',
                        last_page: parent.attr('page-last-page') ? parent.attr('page-last-page') : '[' + name + '-last-page]'
                    }
                };

                if ($(data.selector.item + ':eq(0)').length) {
                    data.clone = $(data.selector.item + ':eq(0)')[0].outerHTML;
                }
            }

            return data;
        },
        get: function (name) {
            if (typeof name === 'object') {
                var model_name = pagination.model.name(name);

                if (typeof pagination.model[model_name] === 'undefined') {
                    var model = pagination.model.data(name);
                    pagination.model.set(model);
                }

                name = model_name;
            }

            return pagination.model[name];
        }
    },

    print: function (model, json) {
        $('[page-preloader="' + model.name + '"]').remove();

        if (model.replace) {
            $(model.selector.list).html('');
        }

        if (json && typeof json.last_page !== 'undefined') {
            $(model.selector.last_page).html(json.last_page);
            if (model.last_page != json.last_page) {
                model.last_page = json.last_page;
                pagination.model.set(model);
            }

            if (json.last_page == model.page) {
                $('[page-last-hide="' + model.name + '"]').hide();
            }
        }

        if (json && json.data && json.data.length) {
            $.each(json.data, function (i, item) {
                var html = $(model.clone),
                    html = typeof model.html === 'function'
                        ? model.html(html, item)
                        : html;

                if (model.method == 'append') {
                    $(model.selector.list).append(html);
                } else {
                    $(model.selector.list).prepend(html);
                }
            });
        } else {
            $(model.selector.list).html(model.empty ? model.empty : 'Ничего не найдено');
        }

        if (model.replace) {
            $(model.selector.list).css('height', 'auto');
        }

        $(model.selector.list).trigger('pagination.print');

        if (typeof webp === 'object') {
            if (webp.init) {
                webp.init();
            }
        }
    },

    init: function () {
        $(document)
            .on('click', '[page-next]', pagination.next)
            .on('click', '[page-prev]', pagination.prev)
            .on('scroll', '[page-scroll]', pagination.scroll);
    },

    scroll: function () {
        var model = pagination.model.get($(this));

        if (model.page < model.last_page) {
            if ($(window).height() + $(window).scrollTop() >= $(document).height() - 300 && !pagination.load) {
                pagination.load = true;
                model.page++;
                pagination.load(model, function (json) {
                    pagination.print(model, json);
                    pagination.load = false;
                });
            }
        }
    },

    prev: function () {
        var model = pagination.model.get($(this));

        if (model.page > 1) {
            model.page--;
            pagination.load(model, function (json) {
                pagination.print(model, json);
            });
        }
    },

    next: function () {
        var model = pagination.model.get($(this));

        if (model.page < model.last_page) {
            model.page++;
            pagination.load(model, function (json) {
                pagination.print(model, json);
            });
        }
    },

    load: function (model, callback) {
        pagination.model.set(model);

        $(model.selector.current_page).html(model.page);

        var preloader = '<div page-preloader="' + model.name + '">' + (model.preloader ? model.preloader : '<div class="text-center my-5 text-muted">Загрузка..</div>') + '</div>';

        if (model.replace) {
            $(model.selector.list).css('height', $(model.selector.list).css('height'));
            $(model.selector.list).html(preloader);
        } else {
            $(model.selector.list).append(preloader);
        }

        if (typeof scroll === 'object') {
            var elem_to = (
                $('a[name="' + model.name + '"]').length
                    ? $('a[name="' + model.name + '"]')
                    : (
                        $('#' + model.name).length ? $('#' + model.name) : false
                    )
            );
            scroll.to(elem_to);
        }

        var data = typeof model.filter === 'function' ? model.filter() : (
            typeof model.filter === 'object' ? model.filter : {}
        );

        data.page = model.page;
        data.count = data.count ? data.count : model.count;

        ajax({
            url: model.url,
            data: data
        }, callback);
    }

}

pagination.init();