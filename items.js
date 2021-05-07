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
*/

window.items = {

    ajaxProcess: false,

    model: {},

    create: function (model) {
        if (!model.url) {
            model.url = $('[items-list-' + model.name + ']').attr('items-list-' + model.name);
        }

        model.items = model.items ? model.items : {};
        model.data = typeof model.data === 'object' && model.data != null ? model.data : {};
        model.outerHTML = $('[items-html-' + model.name + ']:eq(0)')[0].outerHTML;

        items.model[model.name] = model;

        setTimeout(items.init, 0);
    },

    init: function () {
        $.each(items.model, function (name, model) {
            if (!model.init) {
                items.model[name].init = true;

                items.clear(model);

                if (model.scroll) {
                    items.events.scroll(model);
                }

                var elem = items.elem(model);

                if (model.first_load) {
                    elem.empty.hide();
                    elem.preloader.show();

                    items.load(model, function (response) {
                        elem.preloader.hide();

                        if (response.total) {
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
        return model.items.to != model.items.total;
    },

    loadNextData: function (model) {
        if (!items.ajaxProcess && items.isNextData(model)) {
            var elem = items.elem(model);

            elem.preloader.show();

            model.data.page = model.items.current_page + 1;

            items.load(model, function (response) {
                elem.preloader.hide();

                if (response.data.length) {
                    items.print(model, response);
                }
            }, {
                ajaxProcessTimeout: 1000
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

        if (!items.ajaxProcess) {
            items.ajaxProcess = true;

            if (model.onBeforeLoad) {
                model.onBeforeLoad();
            }

            ajax({
                url: model.url,
                data: model.data
            }, function (response) {
                items.model[model.name].items = response;

                if (options.ajaxProcessTimeout) {
                    setTimeout(function () {
                        items.ajaxProcess = false;
                    }, options.ajaxProcessTimeout);
                } else {
                    items.ajaxProcess = false;
                }

                callback(response);
            });
        }
    },

    html: function (model, data, i) {
        var html = typeof model.html === 'function'
            ? model.html($(model.outerHTML), data, i)
            : $(model.outerHTML);

        if (html) {
            if (data && typeof data === 'object') {
                $.each(data, function (name, value) {
                    html.find('[html-' + name.replace(/_/g, '-') + ']').html(value);
                });
            }

            return html.show()
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