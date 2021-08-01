/* 
    items-html-NAME - шаблон item
    items-list-NAME - родитель списка, в значение можно ставить ссылку на список
    items-paginate="10" - атрибут в items-list-NAME для кол-ва материалов
    items-preloader-NAME - прелоадер
    items-empty-NAME - пусто
    items-show-more-NAME - Кнопка показать ещё

    items.create({
        name: 'название списка'
        url: 'ссылка на список',
        data: { данные при ajax запросе к списку },
        scroll: true - подгрузка по скроллу (на родителе списка)
        scroll_elem: selector - элемент по котрому надо скролить
        scroll_window: true - подгрузка по скроллу на window
        first_load: true - первоначально подгрузит список из ссылки
        onBeforeLoad: function(){ запуск до ajax запроса },
        onPrint: function(){ запуск после вывода списка },
        onBeforeScrollOriginal : () => { запуск до прокрутки скролла в исходное состояние }
        items: { data: [ список, если есть, то выведет сразу ] },
        html: function(html, data){ html - $(item), data - { данные } },
        prepend: true | false (default) - сверху или нет
    });

    items.update('name');
    items.htmlUpdate(name, item, data);
*/

window.items = {

    ajaxProcess: {},
    updateTimeout: {},

    model: {},

    update: function (name) {
        if ($('[items-list-' + name + ']').length) {
            var model = items.model[name],
                elem = items.elem(model);

            elem.list.hide().find('[items-html-' + model.name + ']').remove();
            elem.empty.hide();
            elem.preloader.show();

            if (items.updateTimeout[name]) clearTimeout(items.updateTimeout[name]);

            items.updateTimeout[name] = setTimeout(() => {
                items.ajaxProcess[model.name] = false;

                items.load(model, function (response) {
                    elem.preloader.hide();

                    items.print(model, response);
                });
            }, 1000);
        }
    },

    create: function (model) {
        if ($('[items-list-' + model.name + ']').length) {
            if (!model.url) {
                model.url = $('[items-list-' + model.name + ']').attr('items-list-' + model.name);
            }

            model.modal = model.modal ? model.modal : null;
            if (model.modal != null) {
                model.modal.outerHTML = $('[items-modal-' + model.name + ']:eq(0)')[0].outerHTML;

                if (!model.modal.selector) {
                    model.modal.selector = '[items-html-' + model.name + ']';
                }
            }

            model.scroll_elem = model.scroll_elem ? model.scroll_elem : false;
            model.prepend = model.prepend ? model.prepend : false;
            model.items = model.items ? model.items : {
                current_page: 1
            };
            model.outerHTML = $('[items-html-' + model.name + ']:eq(0)')[0].outerHTML;
            $('[items-html-' + model.name + ']:eq(0)').remove();
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

                items.events.update(model);
                items.events.showMore(model);
                items.events.modal(model);

                var elem = items.elem(model);

                if (model.first_load) {
                    elem.empty.hide();
                    elem.preloader.show();

                    items.load(model, function (response) {
                        elem.preloader.hide();

                        items.print(model, response);

                        setTimeout(items.init, 0);
                    });
                } else if (model.items.data) {
                    items.print(model, model.items);

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
        elem.isset.hide();

        elem.list.off('scroll');
        elem.list.off('update');
        elem.showMore.off('click');
    },

    isNextData: function (model) {
        if (model.items.to == null) return true;
        return model.items.to != model.items.total;
    },

    loadNextData: function (model, callback) {
        model = items.model[model.name];

        if (!items.ajaxProcess[model.name] && items.isNextData(model)) {
            var elem = items.elem(model);

            elem.preloader.show();

            items.load(model, function (response) {
                elem.preloader.hide();

                if (!items.isNextData(model)) {
                    elem.showMore.hide();
                }

                if (response.data && Object.keys(response.data).length) {
                    items.print(model, response);
                    if (callback) callback();
                } else {
                    if (callback) callback();
                }
            }, {
                ajaxProcessTimeout: 1000,
                page: model.items.current_page + 1
            });
        } else {
            if (callback) callback();
        }
    },

    events: {
        modal: function (model) {
            if (model.modal != null) {
                $(document)
                    .on('click', model.modal.selector, function () {
                        var entry_id = $(this).closest('[items-html-' + model.name + ']').attr('items-html-' + model.name);

                        model.modal.data(entry_id, function (data) {
                            var html = $(model.modal.outerHTML);

                            html = items.dataInHtml(html, data);

                            if (typeof model.modal.html === 'function') {
                                html = model.modal.html(html, data);
                            }

                            $('[items-modal-' + model.name + ']').remove();

                            $('body').append(html);

                            $('[items-modal-' + model.name + ']').modal('show');
                        });
                    });
            }
        },
        showMore: function (model) {
            var elem = items.elem(model);

            elem.showMore.on('click', function () {
                items.loadNextData(model);
            });
        },
        update: function (model) {
            var elem = items.elem(model);

            elem.list.on('update', function () {
                items.update(model.name);
            });
        },
        scroll: function (model) {
            var elem = items.elem(model),
                isScrollStart = function (scroll_elem) {
                    return scroll_elem == 'window'
                        ? $(window).scrollTop() < 300
                        : scroll_elem.scrollTop() < 300;
                },
                isScrollEnd = function (scroll_elem) {
                    if (model.prepend) {
                        return isScrollStart(scroll_elem);
                    }

                    if (scroll_elem == 'window') {
                        return $(window).height() + $(window).scrollTop() >= elem.list.height() - 300;
                    }

                    return scroll_elem.height() + scroll_elem.scrollTop() >= scroll_elem[0].scrollHeight - 300;
                };

            if (model.scroll_window) {
                $(window).on('scroll', function () {
                    if (isScrollEnd('window')) {
                        items.loadNextData(model);
                    }
                });
            } else if (model.scroll_elem) {
                model.scroll_elem.on('scroll', function () {
                    if (isScrollEnd(model.scroll_elem)) {
                        items.loadNextData(model);
                    }
                });
            } else {
                elem.list.on('scroll', function () {
                    if (isScrollEnd(elem.list)) {
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
            isset: $('[items-isset-' + model.name + ']'),
            list: $('[items-list-' + model.name + ']'),
            showMore: $('[items-show-more-' + model.name + ']'),
            html: $(model.outerHTML),
            scroll: model.scroll_elem ? model.scroll_elem : $('[items-list-' + model.name + ']')
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

            var elem = items.elem(model),
                data = typeof model.data === 'function' ? model.data() : model.data;

            if (typeof data.paginate === 'undefined' && elem.list.attr('items-paginate')) {
                data.paginate = elem.list.attr('items-paginate');
            }

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
        var parts = str.split('.');

        for (var i = 0; i < parts.length; i++) {
            data = data[parts[i]];

            if (!data) {
                break;
            }
        }

        return data ? data : null;
    },

    dataInHtml: function (html, data) {
        if (data && typeof data === 'object') {
            $.each(data, function (name, value) {
                if (name.indexOf('[') == -1) {
                    html.find('[html-' + name.replace(/_/g, '-') + ']').html(value);
                }
            });

            html.find('[attr]').each(function () {
                items.attr($(this), data);
            });

            items.attr(html, data);

            html.find('[html]').each(function () {
                var value = items.getDataValue($(this).attr('html'), data);

                if (value) {
                    $(this).html(value);

                    if ($(this).css('display') == 'none') {
                        $(this).show();
                    }
                }
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
            if (typeof data === 'object' && data != null) {
                if (data.id) {
                    html.attr('items-html-' + model.name, data.id);
                }
            }

            return html.show();
        }
    },

    htmlUpdate: function (name, item, data) {
        if (item.length) {
            var model = items.model[name],
                new_item = items.html(model, data);

            item.after(new_item).remove();
        }
    },

    htmlAppend: function (name, data) {
        var model = items.model[name],
            new_item = items.html(model, data),
            elem = items.elem(model);

        elem.list.append(new_item);
    },

    print: function (model, response) {
        var elem = items.elem(model);

        if (response.data && Object.keys(response.data).length) {
            elem.list.show();
            elem.isset.show();

            if (model.prepend) {
                var currentScroll = elem.scroll.scrollTop(),
                    currentHeight = elem.list.height();

                $.each(response.data, function (i, data) {
                    elem.list.prepend(items.html(model, data, i));
                });

                if (model.onBeforeScrollOriginal) {
                    model.onBeforeScrollOriginal(response);
                }

                elem.scroll.scrollTop(currentScroll + (elem.list.height() - currentHeight));
            } else {
                $.each(response.data, function (i, data) {
                    elem.list.append(items.html(model, data, i));
                });
            }
        } else {
            elem.empty.show();
            elem.list.hide();
            elem.isset.hide();
        }

        if (model.onPrint) {
            model.onPrint(response);
        }
    }

}

$(items.init);