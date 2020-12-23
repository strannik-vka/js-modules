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
                $(document).on('click', '[filter-event="' + model.name + '"]', pagination.filter);

                if (model.scroll_laod) {
                    $(document).on('scroll', function () {
                        pagination.scroll(model.name);
                    });
                }
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
                    scroll_laod: typeof parent.attr('page-scroll-load') !== 'undefined' ? true : false,
                    selector: {
                        list: parent.attr('page-list') ? parent.attr('page-list') : '[page-model="' + name + '"]',
                        item: parent.attr('page-item') ? parent.attr('page-item') : '[' + name + '-item]',
                        current_page: parent.attr('page-current-page') ? parent.attr('page-current-page') : '[' + name + '-current-page]',
                        last_page: parent.attr('page-last-page') ? parent.attr('page-last-page') : '[' + name + '-last-page]'
                    }
                };

                if (data.scroll_laod) {
                    data.replace = false;
                }

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

    filter: function (name) {
        var model = pagination.model.get(name ? name : $(this));

        model.page = 1;

        pagination.load(model, function (json) {
            pagination.print(model, json);
        });
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
            var scroll_top = $(window).scrollTop();

            $.each(json.data, function (i, item) {
                var html = $(model.clone),
                    html = typeof model.html === 'function'
                        ? model.html(html, item)
                        : html;

                if (model.display) {
                    html.css('display', model.display);
                }

                if (model.method == 'append') {
                    $(model.selector.list).append(html);
                } else {
                    $(model.selector.list).prepend(html);
                }

                $(window).scrollTop(scroll_top);
            });
        } else {
            $(model.selector.list).html(model.empty ? model.empty : 'Ничего не найдено');
        }

        $(model.selector.list).css('height', 'auto').trigger('pagination.print');
    },

    init: function () {
        $(document)
            .on('click', '[page-next]', pagination.next)
            .on('click', '[page-prev]', pagination.prev)
            .on('scroll', '[page-scroll]', pagination.scroll);
    },

    scroll: function (name) {
        var model = pagination.model.get(name ? name : $(this));

        if (model.page < model.last_page) {
            if ($(window).height() + $(window).scrollTop() >= $(document).height() - 300 && !pagination.loadStatus) {
                pagination.loadStatus = true;
                model.page++;
                pagination.load(model, function (json) {
                    pagination.print(model, json);
                    setTimeout(function () {
                        pagination.loadStatus = false;
                    }, 1000);

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

    next: function (name, callback, obj) {
        var model = pagination.model.get(name ? name : $(this));

        if (obj) {
            model = Object.assign(model, obj);
        }

        if (model.page < model.last_page) {
            model.page++;
            pagination.load(model, function (json) {
                pagination.print(model, json);
                if (callback) callback(true);
            });
        } else {
            if (callback) callback(false);
        }
    },

    preloader: function (replace, model) {
        if (!$('[page-preloader]').length) {
            if (typeof model === 'string') {
                model = pagination.model.get(model);
            }

            if (typeof model.preloader !== 'undefined' && model.preloader !== false) {
                var preloader = (
                    model.preloader
                        ? $(model.preloader)
                        : $('<div class="text-center py-5 text-muted">Загрузка..</div>')
                );

                preloader.attr('page-preloader', model.name);
            } else {
                preloader = false;
            }

            if (replace) {
                $(model.selector.list).css('height', $(model.selector.list).css('height'));
                if (preloader) $(model.selector.list).html(preloader);
            } else {
                if (preloader) $(model.selector.list).append(preloader);
            }
        }
    },

    loadStatus: false,
    load: function (model, callback) {
        $(model.selector.current_page).html(model.page);

        pagination.preloader(model.replace, model);

        var data = typeof model.filter === 'function' ? model.filter() : (
            typeof model.filter === 'object' ? model.filter : {}
        );

        if (typeof data === 'string') {
            data += '&page=' + model.page;
            data += '&count=' + (data.count ? data.count : model.count);

            if (model.pushState) {
                history.pushState(null, null, location.pathname + '?' + data);
            }
        } else {
            data.page = model.page;
            data.count = data.count ? data.count : model.count;
        }

        ajax({
            url: model.url,
            data: data
        }, callback);
    }

}

pagination.init();