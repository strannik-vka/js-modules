/* 
    items-html-NAME - шаблон item
    items-list-NAME - родитель списка, в значение можно ставить ссылку на список
    items-preloader-NAME - прелоадер
    items-empty-NAME - пусто

    items.create({
        name: 'название списка'
        url: 'ссылка на список',
        data: { данные при ajax запросе к списку },
        scroll: true - подгрузка по скроллу (на родителе спсика)
        scroll_window: true - подгрузка по скроллу на window
        first_load: true - подгрузит список из ссылки
        onBeforeLoad: function(){ запуск до ajax запроса },
        onPrint: function(){ запуск после вывода списка },
        items: { data: [ список, если есть, то выведет сразу ] },
        html: function(html, data){ html - $(item), data - { данные } }
    });

    items.update('name');
*/

window.items = {

    ajaxProcess: {},

    model: {},

    update: function (name) {
        if ($('[items-list-' + model.name + ']').length) {
            var model = items.model[name],
                elem = items.elem(model);

            elem.list.hide().find('[items-html-' + model.name + ']').remove();
            elem.empty.hide();
            elem.preloader.show();

            items.load(model, function (response) {
                elem.preloader.hide();

                if (response.data.length) {
                    items.print(model, response);
                } else {
                    elem.empty.show();
                }
            });
        }
    },

    create: function (model) {
        if ($('[items-list-' + model.name + ']').length) {
            if (!model.url) {
                model.url = $('[items-list-' + model.name + ']').attr('items-list-' + model.name);
            }

            model.items = model.items ? model.items : {};
            model.outerHTML = $('[items-html-' + model.name + ']:eq(0)')[0].outerHTML;
            model.data = typeof model.data !== 'undefined' && model.data != null ? model.data : {};

            if (items.model[model.name]) {
                model.clear = true;
            }

            items.model[model.name] = model;

            setTimeout(items.init, 0);
        }
    },

    init: function () {
        $.each(items.model, function (name, model) {
            if (!model.init) {
                items.model[name].init = true;

                if (model.clear) {
                    items.clear(model);
                }

                if (model.scroll || model.scroll_window) {
                    items.events.scroll(model);
                }

                var elem = items.elem(model);

                if (model.first_load) {
                    elem.empty.hide();
                    elem.preloader.show();

                    items.load(model, function (response) {
                        elem.preloader.hide();

                        if (response.data.length) {
                            items.print(model, response);
                        } else {
                            elem.empty.show();
                            elem.list.hide();
                        }

                        setTimeout(items.init, 0);
                    });
                } else if (model.items.data) {
                    if (model.items.data.length) {
                        items.print(model, model.items);
                    } else {
                        elem.empty.show();
                        elem.list.hide();
                    }

                    setTimeout(items.init, 0);
                } else {
                    setTimeout(items.init, 0);
                }

                return false;
            }
        });
    },

    clear: function (model) {
        var elem = items.elem(model);

        elem.list.find('[items-html-' + model.name + ']').remove();
        elem.preloader.hide();
        elem.empty.hide();
        elem.list.hide();

        elem.list.off('scroll');
    },

    isNextData: function (model) {
        return model.items.to != null && model.items.to != model.items.total;
    },

    loadNextData: function (model) {
        model = items.model[model.name];

        if (!items.ajaxProcess[model.name] && items.isNextData(model)) {
            var elem = items.elem(model);

            elem.preloader.show();

            items.load(model, function (response) {
                elem.preloader.hide();

                if (response.data.length) {
                    items.print(model, response);
                }
            }, {
                ajaxProcessTimeout: 1000,
                page: model.items.current_page + 1
            });
        }
    },

    events: {
        scroll: function (model) {
            var elem = items.elem(model);

            if (model.scroll_window) {
                $(window).on('scroll', function () {
                    if ($(window).height() + $(window).scrollTop() >= $(document).height() - 300) {
                        items.loadNextData(model);
                    }
                });
            } else {
                elem.list.on('scroll', function () {
                    if (elem.list.height() + elem.list.scrollTop() >= elem.list[0].scrollHeight - 300) {
                        items.loadNextData(model);
                    }
                });
            }
        },
    },

    elem: function (model) {
        return {
            preloader: $('[items-preloader-' + model.name + ']'),
            empty: $('[items-empty-' + model.name + ']'),
            list: $('[items-list-' + model.name + ']'),
            html: $(model.outerHTML)
        };
    },

    load: function (model, callback, options) {
        if (typeof options !== 'object' || options == null) {
            options = {};
        }

        if (!items.ajaxProcess[model.name]) {
            items.ajaxProcess[model.name] = true;

            if (model.onBeforeLoad) {
                model.onBeforeLoad();
            }

            var data = typeof model.data === 'function' ? model.data() : model.data;

            if (options.page) {
                data.page = options.page;
            }

            ajax({
                url: model.url,
                data: data,
                queue: true
            }, function (response) {
                items.model[model.name].items = response;

                if (options.ajaxProcessTimeout) {
                    setTimeout(function () {
                        items.ajaxProcess[model.name] = false;
                    }, options.ajaxProcessTimeout);
                } else {
                    items.ajaxProcess[model.name] = false;
                }

                if (model.onAfterLoad) {
                    model.onAfterLoad(response);
                }

                callback(response);
            });
        }
    },

    attr: function (elem, data) {
        if (elem.attr('attr')) {
            var attr_arr = elem.attr('attr').split(':');
            elem.attr(attr_arr[0].replace(/_/g, '-'), items.getDataValue(attr_arr[1], data));
        }
    },

    getDataValue: function (str, data) {
        return str.split('.').reduce((a, v) => {
            if (a === null || !a) {
                return data[v] ? data[v] : null;
            }

            return a[v] ? a[v] : null;
        }, null);
    },

    dataInHtml: function (html, data) {
        if (data && typeof data === 'object') {
            $.each(data, function (name, value) {
                html.find('[html-' + name.replace(/_/g, '-') + ']').html(value);
            });

            html.find('[attr]').each(function () {
                items.attr($(this), data);
            });

            items.attr(html, data);

            html.find('[html]').each(function () {
                $(this).html(items.getDataValue($(this).attr('html'), data));
            });
        }

        return html;
    },

    html: function (model, data, i) {
        var html = $(model.outerHTML);

        html = items.dataInHtml(html, data);

        if (typeof model.html === 'function') {
            html = model.html(html, data, i);
        }

        if (html) {
            return html.show();
        }
    },

    print: function (model, response) {
        var elem = items.elem(model);

        elem.list.show();

        $.each(response.data, function (i, data) {
            elem.list.append(items.html(model, data, i));
        });

        if (model.onPrint) {
            model.onPrint();
        }
    }

}

$(items.init);