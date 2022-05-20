/* 
    items-html-NAME - шаблон item
    items-list-NAME - родитель списка, в значение можно ставить ссылку на список
    items-paginate="10" - атрибут в items-list-NAME для кол-ва материалов
    items-preloader-NAME - прелоадер
    items-empty-NAME - пусто
    items-show-more-NAME - Кнопка показать ещё
    items-total-NAME - Общее кол-во записей
    items-scroll-window-NAME - подгрузка по скроллу на window

    items.create({
        modal: {
            name: '', // NAME моалки
            data: (id, callback), // в callback возвращаем объект с данными для вывода
            html: (html, data), // изменить html перед рендером,
            onRender: data => {} // запускается после рендера
        },
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
        onInit : () => { запуск после инициализации }
        items: { data: [ список, если есть, то выведет сразу ] },
        html: function(html, data){ html - $(item), data - { данные } },
        prepend: true | false (default) - сверху или нет
        ajaxProcessChange: true (default) | false - отключить разрешение след. подгрузки
    });

    items.update('name');
    items.htmlUpdate(name, item, data);
    items.modal();
*/

window.items = {

    ajaxProcess: {},
    updateTimeout: {},
    updates: {},

    model: {},

    update: function (name) {
        if ($('[items-list-' + name + ']').length) {
            var model = items.model[name],
                elem = items.elem(model);

            items.updates[name] = true;

            elem.total.html('0');
            elem.list.hide().find('[items-html-' + model.name + ']').remove();
            elem.empty.hide();
            elem.preloader.show();

            if (items.updateTimeout[name]) clearTimeout(items.updateTimeout[name]);

            items.updateTimeout[name] = setTimeout(() => {
                items.ajaxProcess[model.name] = false;

                items.load(model, function (response) {
                    elem.preloader.hide();

                    if (items.isNextData(model)) {
                        elem.showMore.show();
                    } else {
                        elem.showMore.hide();
                    }

                    if (items.isLoopReverse(model)) {
                        items.model[model.name].loop_iteration = response.total;
                    } else {
                        items.model[name].loop_iteration = 1;
                    }

                    items.print(model, response);

                    items.updates[name] = false;
                });
            }, 1000);
        }
    },

    create: function (model) {
        model.modal = model.modal ? model.modal : null;
        if (model.modal != null) {
            model.modal.name = model.modal.name ? model.modal.name : model.name;

            if (!model.modal.outerHTML) {
                model.modal.outerHTML =
                    $('[items-modal-' + model.modal.name + ']:eq(0)').length
                        ? $('[items-modal-' + model.modal.name + ']:eq(0)')[0].outerHTML
                        : null;
            }

            if (!model.modal.selector) {
                model.modal.selector = '[items-html-' + model.name + ']';
            }
        }

        if ($('[items-list-' + model.name + ']').length) {
            if (!model.url) {
                model.url = $('[items-list-' + model.name + ']').attr('items-list-' + model.name);
            }

            model.scroll_elem = model.scroll_elem ? model.scroll_elem : false;
            model.prepend = model.prepend ? model.prepend : false;
            model.ajaxProcessChange = typeof model.ajaxProcessChange !== 'undefined' ? model.ajaxProcessChange : true;
            model.items = model.items ? model.items : {
                current_page: 1
            };
            model.loop_iteration = 1;

            model.outerHTML = (
                typeof model.outerHTML === 'function'
                    ? model.outerHTML()
                    : (
                        items.model[model.name]
                            ? items.model[model.name].outerHTML
                            : $('[items-html-' + model.name + ']:eq(0)')[0].outerHTML
                    )
            );

            if ($('[items-html-' + model.name + ']:eq(0)').parents('[items-list-' + model.name + ']').length == 0) {
                $('[items-html-' + model.name + ']:eq(0)').remove();
            }

            model.data = typeof model.data !== 'undefined' && model.data != null ? model.data : {};

            if (items.model[model.name]) {
                model.clear = true;

                if (model.onInit) {
                    model.onInit = null;
                }
            }

            if ($('[items-scroll-window-' + model.name + ']').length) {
                model.scroll_window = true;
            }
        }

        items.model[model.name] = model;

        setTimeout(items.init, 0);
    },

    init: function () {
        var initEnd = (model) => {
            items.modal.openUrl(model);

            if (model.onInit) {
                model.onInit();
            }

            setTimeout(items.init, 0);
        };

        $.each(items.model, function (name, model) {
            if (!model.init) {
                init = true;

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
                        if (response.current_page != response.last_page) {
                            elem.showMore.show();
                        }

                        elem.preloader.hide();

                        if (items.isLoopReverse(model)) {
                            items.model[model.name].loop_iteration = response.total;
                        } else {
                            items.model[name].loop_iteration = 1;
                        }

                        items.print(model, response);

                        initEnd(model);
                    });
                } else if (model.items && model.items.data) {
                    items.print(model, model.items);

                    initEnd(model);
                } else {
                    initEnd(model);
                }

                return false;
            }
        });
    },

    URLParam: (name) => {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

        if (results == null) {
            return null;
        }

        return decodeURI(results[1]) || 0;
    },

    modal: {
        close: () => {
            history.pushState(null, null, location.pathname);
        },
        open: (model, entry_id) => {
            model.modal.data(entry_id, function (data) {
                if (data.id && model.modal.pushState) {
                    history.pushState(null, null, location.pathname + '?' + model.name + '=' + data.id);
                } else {
                    history.pushState(null, null, location.pathname);
                }

                var html = $(model.modal.outerHTML);

                html = items.dataInHtml(html, data);

                if (typeof model.modal.html === 'function') {
                    html = model.modal.html(html, data);
                }

                html = items.isset(html, data);

                $('[items-modal-' + model.modal.name + ']').remove();

                $('body').append(html);

                if (typeof model.modal.onRender === 'function') {
                    model.modal.onRender(data);
                }

                $('[items-modal-' + model.modal.name + ']').modal('show');
            });
        },
        openUrl: (model) => {
            if (model.modal && model.modal.pushState) {
                if (location.href.indexOf(model.name + '=') > -1) {
                    items.modal.open(model, items.URLParam(model.name));
                }
            }
        }
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
        return model.items.current_page < model.items.last_page || model.items.last_page == null;
    },

    loadNextData: function (model, callback) {
        model = items.model[model.name];

        if (!items.ajaxProcess[model.name] && items.isNextData(model) && !items.updates[model.name]) {
            var elem = items.elem(model);

            elem.preloader.show();

            items.load(model, function (response) {
                elem.preloader.hide();

                if (!items.isNextData(model)) {
                    elem.showMore.hide();
                }

                if (response.data && Object.keys(response.data).length) {
                    items.print(model, response);
                    if (callback) callback(true);
                } else {
                    if (callback) callback(false);
                }
            }, {
                ajaxProcessTimeout: 1000,
                page: model.items.current_page + 1
            });
        } else {
            if (callback) callback(false);
        }
    },

    events: {
        modal: function (model) {
            if (model.modal != null) {
                $(document)
                    .on('click', model.modal.selector, (e) => {
                        items.modal.open(model, $(e.currentTarget).closest('[items-html-' + model.modal.name + ']').attr('items-html-' + model.modal.name));
                    })
                    .on('hide.bs.modal', '[entry-modal]', () => {
                        items.modal.close();
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
            total: $('[items-total-' + model.name + ']'),
            preloader: $('[items-preloader-' + model.name + ']'),
            empty: $('[items-empty-' + model.name + ']'),
            isset: $('[items-isset-' + model.name + ']'),
            issetOne: $('[items-isset-one-' + model.name + ']'),
            list: $('[items-list-' + model.name + ']'),
            showMore: $('[items-show-more-' + model.name + ']'),
            html: $(model.outerHTML),
            scroll: model.scroll_elem ? model.scroll_elem : $('[items-list-' + model.name + ']')
        };
    },

    isLoopReverse: function (model) {
        if (typeof items.model[model.name].loop_iteration_reverse !== 'undefined') {
            return items.model[model.name].loop_iteration_reverse;
        }

        return false;
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

                if (model.ajaxProcessChange) {
                    if (options.ajaxProcessTimeout) {
                        setTimeout(function () {
                            items.ajaxProcess[model.name] = false;
                        }, options.ajaxProcessTimeout);
                    } else {
                        items.ajaxProcess[model.name] = false;
                    }
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

    attrAppend: (elem, data) => {
        if (elem.attr('attr-append')) {
            let attrArr = elem.attr('attr-append').split(':'),
                attrName = attrArr[0].replace(/_/g, '-'),
                attrValue = items.getDataValue(attrArr[1], data);

            elem.attr(attrName, elem.attr(attrName) + ' ' + attrValue);
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

            html.find('[attr-append]').each(function () {
                items.attrAppend($(this), data);
            });

            items.attrAppend(html, data);

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

    isset: function (html, data) {
        if (data && typeof data === 'object') {
            html.find('[isset]').each(function () {
                var value = items.getDataValue($(this).attr('isset'), data);

                if (value) {
                    $(this).show();
                } else {
                    $(this).remove();
                }
            });
        }

        return html;
    },

    html: function (model, data, i) {
        var html = $(model.outerHTML);

        if (html.find('[html="loop_iteration"]').length) {
            if (items.model[model.name].loop_iteration_reverse) {
                html.find('[html="loop_iteration"]').html(items.model[model.name].loop_iteration);
                items.model[model.name].loop_iteration--;
            } else {
                html.find('[html="loop_iteration"]').html(items.model[model.name].loop_iteration);
                items.model[model.name].loop_iteration++;
            }
        }

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

            html = items.isset(html, data);

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

    orderBy: (name, key, sort) => {
        let model = items.model[name];

        if (model.items && model.items.data && Object.keys(model.items.data).length) {
            model.items.data.sort((a, b) => {
                if (sort == 'asc') {
                    if (a[key] < b[key]) {
                        return -1;
                    }

                    if (a[key] > b[key]) {
                        return 1;
                    }
                } else if (sort == 'desc') {
                    if (a[key] > b[key]) {
                        return -1;
                    }

                    if (a[key] < b[key]) {
                        return 1;
                    }
                }

                return 0;
            });

            let elem = items.elem(model);

            elem.list.html('');

            if (items.isLoopReverse(model)) {
                items.model[name].loop_iteration = model.items.total;
            } else {
                items.model[name].loop_iteration = 1;
            }

            items.print(model, model.items);
        }
    },

    print: function (model, response) {
        var elem = items.elem(model);

        if (response.total) {
            elem.total.html(response.total);
        }

        if (response.data && Object.keys(response.data).length) {
            elem.list.show();
            elem.isset.show();
            elem.issetOne.show();

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