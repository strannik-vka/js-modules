window.Popper = require('popper.js').default;
window.$ = window.jQuery = require('jquery');
window.summernote = require('summernote');
window.Noty = require('noty');
require('bootstrap');
require('selectize');
var MultipleBlock = require('./MultipleBlock').default;

window.app = {
    init: function () {
        // app.service_mode.init();
        app.textarea_autosize.init();
        app.devEdit();
        app.menu();
        app.filter.init();
        app.item.init();
        app.form.init();
        app.summernote();
        app.fixed();
        app.excel();
        app.meta_parse();

        $(document)
            .on('list', function () {
                app.selectize.init();
                app.tooltip();
                app.item.scroll.load = false;
            })
            .on('input', '[data-url-to-html]', function () {
                var url = $(this).val(),
                    html = app.youtube.getHtml(url);

                if (html) {
                    $(this).val(html);
                }

                if ($(this).attr('data-youtube-info')) {
                    var field = $(this).attr('data-youtube-info').split(':'),
                        input = $('form [name="' + field[0] + '"]');

                    app.youtube.getInfo(url, (info) => {
                        if (info[field[1]]) {
                            if (input.attr('summernote')) {
                                input.summernote('code', info[field[1]]);
                            } else {
                                input.val(info[field[1]]);
                            }
                        }
                    });
                }
            });
    },

    meta_parse: function () {
        var ajaxTimeout = false,
            ajax = function (url, callback) {
                if (ajaxTimeout) clearTimeout(ajaxTimeout);

                ajaxTimeout = setTimeout(function () {
                    $.ajax({
                        type: 'post',
                        url: location.pathname + '/getMeta',
                        data: {
                            _token: csrf_token,
                            url: url
                        },
                        dataType: 'json',
                        success: callback,
                        error: callback
                    });
                }, 1000);
            },
            paste = function (json) {
                if (typeof json === 'object' && json != null) {
                    $.each(json, function (name, value) {
                        var input = $('#formModal [name="' + name + '"]'),
                            inputFile = $('#formModal [name="' + name + '_url"][type="hidden"]');

                        if (inputFile.length) {
                            if (inputFile.val() == '' && value) {
                                inputFile.val(value);
                                app.form.fillFiles($('#formModal [files-list="' + name + '"]'), value);
                            }
                        } else if (input.length) {
                            if (input.val() == '' && value) {
                                input.val(value);
                            }
                        }
                    });
                }
            }

        $(document).on('input', '[data-get-meta]', function () {
            ajax($(this).val(), paste);
        });
    },

    excel: function () {
        $('[download-excel]').on('click', function () {
            var url = location.href;

            if (url.indexOf('?') > -1) {
                url += '&excel=1';
            } else {
                url += '?excel=1';
            }

            $('[download-excel-click]').remove();

            $('body').append('<a target="_blank" download-excel-click href="' + url + '" style="display:none"></a>');

            $('[download-excel-click]')[0].click();
        });
    },

    service_mode: {
        init: function () {
            app.service_mode.status();
            $(document).on('change', '[name="site_mode"]', app.service_mode.change);
        },

        status: function () {
            $.get('/admin/setting/status', function (json) {
                if (json.site_mode == 'on') {
                    $('[name="site_mode"]').prop('checked', false);
                } else {
                    $('[name="site_mode"]').prop('checked', true);
                }
            }, 'json');
        },

        change: function () {
            if ($(this).prop('checked')) {
                if (confirm('Действительно включить режим обслуживания?')) {
                    app.service_mode.ajax('off');
                } else {
                    $(this).prop('checked', false);
                }
            } else {
                app.service_mode.ajax('on');
            }
        },

        ajax: function (mode) {
            $.ajax({
                url: '/admin/setting/update',
                type: 'post',
                dataType: 'json',
                data: {
                    _token: csrf_token,
                    site_mode: mode
                }
            });
        }
    },

    fixed: function () {
        $('[table-items] thead th').css('top', $('header').css('height'));
    },

    date_format: function (value) {
        if (value) {
            var date = new Date(value);

            if (date != 'Invalid Date') {
                var month = date.getMonth() + 1,
                    day = date.getDate();

                value = '';
                value += date.getFullYear() + '-';
                value += (month < 10 ? '0' + month : month) + '-';
                value += (day < 10 ? '0' + day : day) + ' ';
                value += date.toLocaleTimeString().slice(0, -3);
            }
        }

        return value;
    },

    form: {
        id: false,
        init: function () {
            $('#formModal')
                .on('show.bs.modal', function () {
                    setTimeout(function () {
                        app.textarea_autosize.resize($('#formModal textarea[data-autosize]'));
                    }, 500)

                    $(this).find('form').attr('action', location.pathname + (app.form.id ? '/' + app.form.id : ''));
                })
                .on('hide.bs.modal', app.form.reset)
                .find('form').on('submit', function (e) {
                    e.preventDefault();
                    app.preloader('Подождите, сохраняю..');
                    app.form.ajax($(this), function (json) {
                        if (json && json.success) {
                            app.item.update(json.success);
                            $('#formModal').modal('hide');
                        }
                    });
                    return false;
                });;

            $(document)
                .on('hidden.bs.modal', '.note-modal', function () {
                    setTimeout(function () {
                        $('body').addClass('modal-open');
                    }, 400);
                })
                .on('change', '[type="file"]', function () {
                    var names = [];

                    $.each($(this)[0].files, function (i, file) {
                        names.push(file.name);
                    });

                    $(this).next().html(names.join(', '));

                    if (names.length) {
                        $(this).parents('.input-group').addClass('active');
                    } else {
                        $(this).parents('.input-group').removeClass('active');
                    }
                })
                .on('input', '#formModal [youtube-embed]', function () {
                    $(this).val(app.youtube_embed($(this).val()));
                })
                .on('click', '[file-delete]', function () {
                    app.form.fileDelete($(this));
                });
        },
        reset: function () {
            app.form.id = false;
            $('[images-list], [files-list]').html('');
            $('#formModal [type="hidden"][name*="_url"]').val('');
            $('[name="_method"]').remove();
            $('#formModal form').trigger('reset');
            $('#formModal [summernote]').summernote('code', '');
            $('#formModal .selectized').each(function () {
                $(this)[0].selectize.clear();
            });

            var blocks = [];
            $('[multiple-block]').each((i, item) => {
                var block_id = $(item).attr('multiple-block');
                if (blocks.indexOf(block_id) == -1) {
                    blocks.push(block_id);
                }
            });
            $.each(blocks, (i, id) => {
                $('[multiple-block="' + id + '"]').slice(1).remove();
            });
        },
        fileHtml: function (url, i, filesDelete) {
            var ext = url.split('.'), ext = ext[ext.length - 1], ext = ext.toLowerCase(), ext = ext.split('?'), ext = ext[0],
                images = ['jpg', 'png', 'jpeg', 'webp', 'gif', 'svg'],
                html = '';

            if (images.indexOf(ext) > -1) {
                html = '<a href="' + url + '" target="_blank"><img src="' + url + '" class="w-100"></a>';
            } else {
                html = '<a href="' + url + '" download target="_blank">Скачать файл' + (i ? ' ' + i : '') + '</a>';
            }

            return '<div class="col-lg-3 mb-2" file-item>' + html + (filesDelete != 'false' ? '<br><a href="javascript://" file-delete="' + url + '">Удалить</a>' : '') + '</div>';
        },
        fileDelete: function (elems, obj) {
            obj = typeof obj === 'object' && obj != null ? obj : {
                confirm: true,
                noty: true
            };

            if (obj.confirm) {
                if (!confirm('Уверены, что хотите удалить?')) return false;
            }

            var files = [],
                field = elems.parents('[files-list]').attr('files-list'),
                slideUp = function (file) {
                    var list = $('[file-delete="' + file + '"]').parents('[files-list]'),
                        file_url = $('#formModal [name="' + list.attr('files-list') + '_url"]');

                    if (file_url.length) {
                        file_url.val('');
                    }

                    $('[file-delete="' + file + '"]').parents('[file-item]').slideUp(function () {
                        $(this).remove();
                    });
                };

            elems.each(function () {
                var file = $(this).attr('file-delete');

                if (file.indexOf(location.host) == -1 && file.indexOf('://') > -1) {
                    slideUp(file);
                } else {
                    files.push(file);
                }
            });

            if (files.length) {
                $.ajax({
                    url: location.pathname + '?file_delete=' + (files.length == 1 ? files[0] : files) + '&id=' + app.form.id + '&field=' + field,
                    method: 'get',
                    dataType: 'json',
                    success: function (json) {
                        if (json.success) {
                            $.each(files, function (i, file) {
                                slideUp(file);
                            });

                            app.item.update(json.success);

                            if (obj.noty) {
                                app.noty('success', 'Успешно сохранено');
                            }

                            if (obj.success) {
                                obj.success();
                            }
                        } else if (json.error) {
                            app.noty('error', json.error);
                        } else {
                            console.log(json);
                        }
                    }
                });
            }
        },
        fillFiles: function (list, images) {
            if (typeof images === 'object' && images != null) {
                $.each(images, function (i, item) {
                    list.append(app.form.fileHtml(item, (i + 1), list.attr('files-delete')));
                });
            } else if (images) {
                list.append(app.form.fileHtml(images, 0, list.attr('files-delete')));
            }
        },
        fill: function (id) {
            app.form.id = id;

            $('#formModal').modal('show');
            $.get(location.pathname + '/' + id + '/edit', function (json) {
                $('#formModal form [name]:not([type="file"])').each(function () {
                    var name = $(this).attr('name')

                    if (typeof $(this).attr('summernote') !== 'undefined') {
                        $(this).summernote('code', json[name]);
                    } else if ($(this)[0].tagName == 'SELECT') {
                        name = name.replace('[', '').replace(']', '');
                        if (typeof json[name] === 'object' && json[name] != null) {
                            if (json[name].length) {
                                var items = [];

                                $.each(json[name], function (i, item) {
                                    if (typeof item === 'object') {
                                        if (item[name + '_id']) {
                                            items.push(item[name + '_id']);
                                        }
                                    } else {
                                        items.push(item);
                                    }
                                });

                                $(this)[0].selectize.setValue(items);
                            } else {
                                $(this)[0].selectize.setValue(json[name]);
                            }
                        } else {
                            if ($(this).attr('selectize-ajax')) {
                                var obj = json[name.replace('_id', '')];
                                if (obj != null) {
                                    $(this)[0].selectize.addOption(obj);
                                    $(this)[0].selectize.setValue(obj.id);
                                }
                            } else {
                                $(this)[0].selectize.setValue(json[name]);
                            }
                        }
                    } else if ($(this).attr('type') == 'checkbox') {
                        if (json[name]) {
                            $(this).prop('checked', true);
                        }
                    } else if (name != '_token') {
                        var value = json[name];

                        value = app.date_format(value);

                        $(this).val(value).trigger('input');
                    }
                });

                var files = $('#formModal [files-list]');
                if (files.length) {
                    files.each(function () {
                        var name = $(this).attr('files-list');
                        app.form.fillFiles($(this), json[name]);
                    });
                }

                if (typeof json === 'object' && json != null) {
                    $.each(json, function (name, value) {
                        if (typeof value === 'object' && value != null) {
                            $.each(value, function (key, item) {
                                if (typeof item === 'object' && item != null) {
                                    $.each(item, function (item_key, item_val) {
                                        var input = $('#formModal form [name="' + name + '[' + item_key + '][]"]');

                                        if (input.eq(key).length == 0) {
                                            MultipleBlock.add(input.eq(-1).parents('[multiple-block]'), {
                                                animate: false,
                                                after: true
                                            });
                                            input = $('#formModal form [name="' + name + '[' + item_key + '][]"]');
                                        }

                                        if (input.attr('type') == 'file') {
                                            app.form.fillFiles(
                                                $('[files-list="' + name + '[' + item_key + '][]"]').eq(key),
                                                item_val
                                            );
                                        } else {
                                            input.eq(key).val(item_val);
                                        }
                                    });
                                } else {
                                    var input = !isNaN(key)
                                        ? $('#formModal form [name="' + name + '[]"]:eq(' + key + ')')
                                        : $('#formModal form [name="' + name + '[' + key + ']"]');

                                    if (input.attr('type') != 'file') {
                                        input.val(item);
                                    }
                                }
                            });
                        }
                    });
                }

                $('#formModal form').append('<input type="hidden" name="_method" value="PUT">');
            });
        },
        ajax: function (form, callback) {
            $.ajax({
                url: location.pathname + (app.form.id ? '/' + app.form.id : ''),
                type: 'post',
                dataType: 'json',
                processData: false,
                contentType: false,
                data: new FormData(form[0]),
                success: function (json) {
                    app.item.response(json, callback);
                },
                error: function (json) {
                    app.item.response(json, callback);
                }
            });
        },
        isEdit: function () {
            return !$('#formModal [edit="false"]').length;
        }
    },

    selectize: {
        init: function () {
            $('select:not([selectize-no])').selectize();

            $('[selectize-ajax]').each(function () {
                app.selectize.selectize($(this));
            });
        },

        selectize: function (elem) {
            var valueField = elem.attr('value-field') ? elem.attr('value-field') : 'id',
                labelField = elem.attr('label-field') ? elem.attr('label-field') : 'name',
                searchField = elem.attr('search-field') ? elem.attr('search-field').split(',') : ['name'],
                searchParam = elem.attr('search-param') ? elem.attr('search-param').split(',') : searchField[0],
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
                    app.selectize.search(obj, callbaсk);
                },
                load: function (query, callbaсk) {
                    var obj = {
                        url: url
                    };
                    obj[searchParam] = query;
                    app.selectize.search(obj, callbaсk);
                },
                render: {
                    option: function (item, escape) {
                        return '<div class="option">' + escape(item.name) + '</div>';
                    }
                }
            });
        },

        timeOut: false,
        search: function (obj, callbaсk) {
            if (app.selectize.timeOut) clearTimeout(app.selectize.timeOut);
            app.selectize.timeOut = setTimeout(function () {
                obj._token = csrf_token;
                $.get(obj.url, obj, function (json) {
                    callbaсk(json.data);
                }, 'json').fail(function () {
                    callbaсk(false);
                });
            }, 800);
        }
    },

    youtube_embed: function (url) {
        if (url.indexOf('embed') == -1 && url.indexOf('youtube') > -1) {
            if (url.indexOf('=') > -1) {
                url = url.split('=')[1];
            } else {
                var arr = url.split('/');
                url = arr[arr.length - 1];
            }
            url = 'https://www.youtube.com/embed/' + url;
        }

        if (url.indexOf('player') == -1 && url.indexOf('vimeo') > -1) {
            var arr = url.split('/');
            url = 'https://player.vimeo.com/video/' + arr[arr.length - 2] + '?h=' + arr[arr.length - 1];
        }

        return url;
    },

    youtube: {
        getInfo: (url, callback) => {
            $.get('https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=' + app.youtube.getId(url) + '&key=AIzaSyB6eE0_ePJU8OLKChDrjAE0y3P4PhI-i6U', (response) => {
                callback(
                    response && response.items && response.items[0] && response.items[0].snippet
                        ? response.items[0].snippet
                        : {}
                );
            })
        },
        getId: (url) => {
            if (url.indexOf('embed') == -1 && url.indexOf('youtube') > -1) {

                if (url.indexOf('=') > -1) {
                    url = url.split('=')[1];
                } else {
                    var arr = url.split('/');
                    url = arr[arr.length - 1];
                }

                return url;
            }

            return false;
        },
        getHtml: (url) => {
            var id = app.youtube.getId(url);

            return id ? '<iframe src="https://www.youtube.com/embed/' + id + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' : false;
        }
    },

    item: {
        json: {},

        init: function () {
            app.item.marginTop();
            app.item.list();

            $(document)
                .on('focus', '[data-id] .blur', function () {
                    $(this).removeClass('blur').addClass('focus');
                })
                .on('blur', '[data-id] .focus', function () {
                    $(this).removeClass('focus').addClass('blur');
                })
                .on('input', '[data-id] [name]:not([not-save])', function () {
                    var input = $(this), form;

                    if (input.attr('youtube-embed')) {
                        input.val(app.youtube_embed(input.val()));
                    }

                    if (input.parents('form').length) {
                        form = input.parents('form');
                    }

                    app.item.edit(input, form, function () {
                        if (input.attr('type') == 'file' && form.find('img').length) {
                            app.item.image.preview(input, form.find('img'));
                        }
                    });
                })
                .on('change', '[data-id] select[name]:not([not-save])', function () {
                    app.item.edit($(this));
                })
                .on('click', '[edit-open]', function () {
                    app.form.fill($(this).parents('[data-id]').attr('data-id'));
                })
                .on('mousedown', '[data-id] td', function (e) {
                    if ($(e.target)[0].tagName == 'TD' && !$('tr[data-id] .focus').length) {
                        var input = $(this).parents('tr').find('[id^="customCheck"]');
                        input.prop('checked', (input.prop('checked') ? false : true)).trigger('change');
                    }
                })
                .on('change', '#customCheck0', function () {
                    if ($(this).prop('checked')) {
                        $('tr[data-id] [id^="customCheck"]').prop('checked', true);
                    } else {
                        $('tr[data-id] [id^="customCheck"]').prop('checked', false);
                    }
                    $('[checkbox-count]').html($('tr[data-id] [id^="customCheck"]:checked').length);
                })
                .on('change', 'tr[data-id] [id^="customCheck"]', function () {
                    $('[checkbox-count]').html($('tr[data-id] [id^="customCheck"]:checked').length);
                })
                .on('scroll', app.item.scroll.run);
        },

        scroll: {
            load: false,

            run: function () {
                if (app.item.scroll.valid()) {
                    app.item.scroll.load = true;
                    app.item.list(app.item.scroll.href(), false, true);
                }
            },

            href: function () {
                if (location.href.indexOf('?') > -1) {
                    return location.href + '&page=' + (app.item.json.current_page + 1);
                } else {
                    return location.href + '?page=' + (app.item.json.current_page + 1);
                }
            },

            valid: function () {
                var valid1 = $(window).height() + $(window).scrollTop() >= $(document).height() - 300 && !app.item.scroll.load,
                    valid2 = app.item.json.current_page < app.item.json.last_page;

                return valid1 && valid2;
            }
        },

        html: {
            encodeEntity: function (str) {
                var buf = [];
                for (var i = str.length - 1; i >= 0; i--) {
                    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
                }
                return buf.join('');
            },
            text: function (type, name, text) {
                if (typeof text === 'string') {
                    text = app.date_format(text);
                    text = app.item.html.encodeEntity(text);
                }

                return $('<div contenteditable class="form-control form-control-sm" type="' + type + '" name="' + name + '">' + (text ? text : '') + '</div>');
            },
            image: function (value, thumb, name) {
                var src = (
                    typeof value === 'object' && value != null
                        ? app.item.image.url(value && value[0] ? value[0] : '', thumb)
                        : app.item.image.url(value, thumb)
                ), count = (
                    typeof value === 'object' && value != null ? value.length : 1
                );

                var elem = '<img data-toggle="tooltip" title="Открыть" class="rounded pointer image" src="' + src + '">';

                if (count) {
                    elem += '<span class="image_count">' + count + '</span>';
                }

                return $('<div class="image_wrap" edit-open="' + name + '">' + elem + '</div>');
            },
            file: function (value, filename) {
                var elem = false;

                if (value) {
                    if (typeof value === 'object') {
                        var list = [];
                        $.each(value, function (i, item) {
                            list.push('<a target="_blank" ' + (filename ? '' : 'download') + ' href="' + item + '">' + (filename ? item : 'Скачать&nbsp;файл') + '</a>');
                        });
                        elem = $(list.join('<br>'));
                    } else {
                        elem = $('<a target="_blank" ' + (filename ? '' : 'download') + ' href="' + value + '">' + (filename ? value : 'Скачать&nbsp;файл') + '</a>');
                    }
                } else {
                    elem = $('<div>—</div>');
                }

                return elem;
            },
            checkbox: function (name, default_value, value, placeholder) {
                return $('<label class="custom-control custom-switch mb-0"><input ' + (value == default_value ? 'checked' : '') + ' name="' + name + '" value="' + default_value + '" type="checkbox" class="custom-control-input"><div class="custom-control-label">' + placeholder + '</div></label>');
            },
            select: function (elem, name, item) {
                var name = elem.attr('name'),
                    select = $('#formModal [name="' + elem.attr('name') + '"]');

                var getOptions = function (elem, select) {
                    if (typeof select[0].selectize !== 'undefined') {
                        $.each(select[0].selectize.options, function (i, item) {
                            elem.append('<option value="' + item.value + '">' + item.text + '</option>');
                        });

                        if (select[0].selectize.settings.placeholder) {
                            elem.attr('placeholder', select[0].selectize.settings.placeholder);
                        }
                    }

                    return elem;
                }

                elem = getOptions(elem, select);

                var name_normal = name.replace('[', '').replace(']', ''),
                    value = item[name_normal];

                if (
                    name.indexOf('_id') > -1 &&
                    elem[0].tagName == 'SELECT' &&
                    elem.find('option[value="' + value + '"]').length == 0
                ) {
                    var data = item[name.replace('_id', '')];
                    if (data && data.name) {
                        var option_text = data.name;

                        if (select.attr('search-field')) {
                            var fields = select.attr('search-field').split(','),
                                option_text_arr = [];

                            $.each(fields, function (i, field) {
                                if (data[field]) {
                                    option_text_arr.push(data[field]);
                                }
                            });

                            if (option_text_arr.length) {
                                option_text = option_text_arr.join(', ');
                            }
                        }

                        elem.append('<option selected value="' + value + '">' + option_text + '</option>');
                    }
                } else {
                    if (typeof value === 'object') {
                        $.each(value, function (i, value_item) {
                            if (typeof value_item === 'object') {
                                elem.find('[value="' + value_item[name_normal + '_id'] + '"]').attr('selected', 'selected');
                            } else {
                                elem.find('[value="' + value_item + '"]').attr('selected', 'selected');
                            }
                        });
                    } else {
                        elem.val(value);
                    }
                }

                elem.addClass('form-control-sm');

                return elem;
            },
            button: function () {
                return $('<button class="btn btn-outline-primary btn-sm text-center btn-edit" edit-open>Изменить</button>');
            },
            tooltip: function (input, elem, item) {
                if (input.attr('data-tooltip-key')) {
                    elem.attr({
                        'data-container': 'body',
                        'data-toggle': 'tooltip',
                        'data-html': 'true',
                        'title': item[input.attr('data-tooltip-key')]
                    });

                    if (input.attr('data-placement')) {
                        elem.attr('data-placement', input.attr('data-placement'));
                    }
                }

                return elem;
            },
            get: function (item) {
                var row = $('<tr data-id="' + item.id + '"></tr>'),
                    elem = false;

                if (app.form.isEdit()) {
                    row.html('<td><div class="d-inline-flex"><div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="customCheck' + item.id + '"><label class="custom-control-label" for="customCheck' + item.id + '"></label></div><svg title="Редактировать" data-toggle="tooltip" edit-open class="icon ml-2" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M25.1875 13.0781V27.0039C25.1875 27.4015 25.1092 27.7951 24.9571 28.1624C24.8049 28.5297 24.5819 28.8634 24.3008 29.1446C24.0197 29.4257 23.686 29.6487 23.3187 29.8008C22.9514 29.9529 22.5577 30.0312 22.1602 30.0312H3.99609C3.19319 30.0313 2.42318 29.7123 1.85544 29.1446C1.2877 28.5768 0.96875 27.8068 0.96875 27.0039V8.83984C0.96875 8.03694 1.2877 7.26693 1.85544 6.69919C2.42318 6.13145 3.19319 5.8125 3.99609 5.8125H16.6716" stroke="#212529" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.6927 0.397328C30.5821 0.275821 30.448 0.177997 30.2985 0.109766C30.1491 0.0415349 29.9873 0.00431447 29.823 0.000353327C29.6588 -0.00360782 29.4954 0.0257726 29.3428 0.0867194C29.1903 0.147666 29.0516 0.238914 28.9353 0.354948L27.9991 1.28654C27.8856 1.40006 27.8219 1.55399 27.8219 1.71449C27.8219 1.87499 27.8856 2.02892 27.9991 2.14244L28.8574 2.99911C28.9136 3.05563 28.9805 3.10047 29.0541 3.13108C29.1278 3.16168 29.2067 3.17743 29.2865 3.17743C29.3662 3.17743 29.4452 3.16168 29.5188 3.13108C29.5925 3.10047 29.6593 3.05563 29.7156 2.99911L30.6283 2.09098C31.09 1.63011 31.1331 0.879392 30.6927 0.397328ZM26.1063 3.17847L12.444 16.8155C12.3611 16.898 12.3009 17.0004 12.2692 17.1129L11.6372 18.995C11.6221 19.0461 11.621 19.1003 11.6341 19.1519C11.6472 19.2035 11.674 19.2507 11.7117 19.2883C11.7493 19.326 11.7965 19.3528 11.8481 19.3659C11.8997 19.379 11.9539 19.3779 12.005 19.3628L13.8857 18.7309C13.9982 18.6991 14.1007 18.6389 14.1832 18.5561L27.8213 4.89331C27.9474 4.7658 28.0182 4.59366 28.0182 4.41428C28.0182 4.23489 27.9474 4.06275 27.8213 3.93524L27.0682 3.17847C26.9405 3.05115 26.7676 2.97965 26.5872 2.97965C26.4069 2.97965 26.234 3.05115 26.1063 3.17847Z" fill="#212529"/></g><defs><clipPath id="clip0"><rect width="31" height="31" fill="white"/></clipPath></defs></svg></div></td>');
                }

                $('#formModal [filter]').each(function () {
                    var filter = $(this);

                    if (filter.attr('key')) {
                        var input = app.item.html.text('string', name),
                            name = filter.attr('key'),
                            readonly = filter.attr('readonly'),
                            placeholder = filter.attr('label');

                    } else {
                        var input = filter.find('[name]'),
                            name = input.attr('name'),
                            readonly = input.attr('readonly'),
                            placeholder = filter.find('label').text();
                    }

                    var name = name.replace('[', '').replace(']', ''),
                        value = item[name];

                    if (input.attr('thumb')) {
                        elem = app.item.html.image(value, input.attr('thumb'), name);
                    } else if (input.attr('type') == 'file') {
                        elem = app.item.html.file(value, (input.attr('data-view-name') == 'true' ? true : false));
                    } else if (input[0].tagName == 'SELECT') {
                        elem = app.item.html.select(input.clone(), name, item);
                    } else if (input.attr('summernote')) {
                        elem = app.item.html.button();
                    } else if (input[0].tagName == 'TEXTAREA') {
                        elem = app.item.html.text('text', name, value).attr({
                            'placeholder': placeholder,
                            'data-autosize': 'false'
                        }).addClass('blur');
                    } else if (input.attr('type') == 'checkbox') {
                        elem = app.item.html.checkbox(name, input.val(), value, placeholder);
                    } else {
                        elem = app.item.html.text('string', name, value).attr('placeholder', placeholder);
                    }

                    if (input.attr('youtube-embed')) {
                        elem.attr('youtube-embed', 'true');
                    }

                    if (readonly) {
                        elem.attr('readonly', 'readonly');

                        if (elem[0].tagName == 'DIV') {
                            elem.removeAttr('contenteditable');
                        }

                        if (input[0].tagName == 'SELECT') {
                            elem.attr('disabled', 'disabled');
                        }
                    }

                    elem = app.item.html.tooltip(input, elem, item);

                    row.append('<td></td>');
                    row.find('td:eq(-1)').append(elem);
                });

                return row;
            }
        },

        update: function (item) {
            if ($('[data-id="' + item.id + '"]').length) {
                $('[data-id="' + item.id + '"]')
                    .after(app.item.html.get(item))
                    .remove();
            } else {
                $('[table-items] tbody').prepend(app.item.html.get(item));
            }

            if ($('[table-items] tbody tr:not([data-id])').length) {
                $('[table-items] tbody tr:not([data-id])').remove();
            }

            $(document).trigger('list');
        },

        marginTop: function () {
            $('[table-items]').css('margin-top', parseFloat($('header').css('height')));
        },

        list: function (url, data, append) {
            if (!append) {
                $('[table-items] tbody').html('');
            }

            $('[data-list-empty]').remove();

            $('[table-items] tbody').append('<tr data-list-preload><td colspan="' + ($('[table-items] thead tr > *').length + 1) + '" class="text-center py-5">Загрузка..</td></tr>');

            data = typeof data === 'object' ? data : {};
            data.is_ajax = true;
            url = url ? url : location.href;

            $.ajax({
                url: url,
                type: 'get',
                data: data,
                success: function (json) {
                    app.item.json = json;

                    $('[data-list-preload]').remove();

                    if (!append) {
                        $('[table-items] tbody').html('');
                    }

                    $.each(json.data, function (i, item) {
                        $('[table-items] tbody').append(app.item.html.get(item));
                    });

                    $('[view-count]').html(json.to ? json.to : 0);
                    $('[total-count]').html(json.total);

                    if (!json.data.length) {
                        if (!append) {
                            $('[table-items] tbody').html('');
                        }

                        $('[table-items] tbody').append('<tr data-list-empty><td colspan="' + ($('[table-items] thead tr > *').length + 1) + '" class="text-center py-5">Ничего не найдено</td></tr>');
                    }

                    $(document).trigger('list');
                }
            });
        },

        image: {
            url: function (url, thumb) {
                if (url && url.indexOf('http') > -1 && url.indexOf(location.host) == -1) {
                    return url;
                }

                if (thumb && url) {
                    var name = url.split('/'),
                        name = name[name.length - 1];
                }

                return url ? (
                    thumb && thumb != 'true' && name
                        ? url.replace(name, thumb + '_' + name)
                        : url
                ) : '/img/admin/no_photo.jpg';
            },
            preview: function (input, img) {
                if (input[0].files && input[0].files[0] && img.length) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        img.attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input[0].files[0]);
                }
            }
        },

        remove: {
            checkbox: function () {
                var recurce = function (callback) {
                    var end = true;

                    $('tr[data-id] [id^="customCheck"]').each(function () {
                        if ($(this).prop('checked')) {
                            end = false;

                            var id = $(this).parents('[data-id]').attr('data-id');

                            app.item.remove.ajax(id, function () {
                                setTimeout(function () {
                                    recurce(callback);
                                }, 0);
                            });

                            return false;
                        }
                    });

                    if (end) {
                        callback();
                    }
                };

                if (confirm('Уверены, что хотите удалить выбранные?')) {
                    app.preloader('Подождите, удаляю..');
                    recurce(function () {
                        app.preloader('close');
                        app.noty('success', 'Успешно удалено');
                    });
                    $('#customCheck0').prop('checked', false);
                }
            },
            one: function (id) {
                if (confirm('Уверены, что хотите удалить?')) {
                    app.preloader('Подождите, удаляю..');
                    app.item.remove.ajax(id, function (success) {
                        if (success) {
                            app.preloader('close');
                            app.noty('success', 'Успешно удалено');
                        }
                    });
                }
            },
            ajax: function (id, callback) {
                $.post(location.pathname + '/' + id, {
                    _token: csrf_token,
                    _method: 'delete'
                }, function (json) {
                    if (json.success) {
                        $('[data-id="' + id + '"]').slideUp(function () {
                            $(this).remove();
                            $('[total-count]').html(parseInt($('[total-count]').html()) - 1);
                            $('[checkbox-count]').html($('tr[data-id] [id^="customCheck"]:checked').length);
                            if (callback) callback(true);
                        });
                    } else if (json.error) {
                        app.noty('error', json.error);
                        if (callback) callback(false);
                    } else {
                        if (callback) callback(false);
                        console.log(json);
                    }
                }, 'json');
            }
        },

        response: function (response, callback, edit) {
            app.preloader('close');

            if (response) {
                if (response.success) {
                    app.noty('success', 'Успешно сохранено');

                    if (!app.form.id && !edit) {
                        $('[total-count]').html(parseFloat($('[total-count]').html()) + 1);
                    }
                } else if (response.errors) {
                    var errors = [];

                    $.each(response.errors, function (i, item) {
                        errors.push(item);
                    });

                    app.noty('error', errors.join('<br>'));
                } else if (response.error) {
                    app.noty('error', response.error);
                }
            } else {
                app.noty('error', 'Ошибка сервера');
                console.log(response);
            }

            if (callback) callback(response);
        },

        edit_timer: {},
        edit: function (input, form, callback) {
            app.preloader('Подождите, сохраняю..');

            var id = input.parents('[data-id]').attr('data-id'),
                name = input.attr('name'),
                value = input[0].tagName == 'DIV' ? input[0].innerText : input.val(),
                timer = input.attr('timer') ? parseFloat(input.attr('timer')) : +new Date();

            input.attr('timer', timer);

            if (app.item.edit_timer[timer]) clearTimeout(app.item.edit_timer[timer]);
            app.item.edit_timer[timer] = setTimeout(function () {
                var data = typeof form !== 'undefined' ? new FormData(form[0]) : new FormData();

                data.append('_token', csrf_token);
                data.append('_method', 'PUT');

                if (typeof form === 'undefined') {
                    if (input.attr('type') == 'checkbox') {
                        value = input.prop('checked') ? value : '';
                    }

                    if (input.attr('multiple')) {
                        var serializeArray = input.serializeArray();

                        $.each(serializeArray, function (i, item) {
                            data.append(item.name, item.value);
                        });
                    } else {
                        data.append(name, value);
                    }
                }

                $.ajax({
                    url: location.pathname + '/' + id,
                    type: 'post',
                    data: data,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    success: function (json) {
                        app.item.response(json, callback, true);
                    },
                    error: function (json) {
                        app.item.response(json, callback, true);
                    }
                });
            }, 1000);
        }
    },

    filter: {
        init: function () {
            app.filter.render();
            app.filter.events();
        },

        events: function () {
            $(document)
                .on('change', '[table-items] thead select[name]', app.filter.apply)
                .on('input', '[table-items] thead [name]', app.filter.apply);
        },

        formData: function () {
            var formData = {};

            $('[table-items] thead [name]').each(function () {
                var name = $(this).attr('name'),
                    val = false;

                if ($(this)[0].tagName == 'SELECT') {
                    val = $.trim($(this).find('option:selected').val());
                } else {
                    val = $.trim($(this)[0].innerText);
                }

                if (val) {
                    formData[name] = val;
                }
            });

            return formData;
        },

        setUrl: function (formData) {
            var arr = [];

            $.each(formData, function (key, val) {
                arr.push(key + '=' + val);
            });

            history.pushState(null, null, location.pathname + '?' + arr.join('&'));
        },

        apply_timer: false,
        apply: function () {
            if (app.filter.apply) clearTimeout(app.filter.apply);
            app.filter.apply = setTimeout(function () {
                var formData = app.filter.formData();
                app.filter.setUrl(formData);
                app.item.list(location.pathname, formData);
            }, 1000);
        },

        render: function () {
            if (app.form.isEdit()) {
                $('[table-items] thead tr').append('<th><div class="d-inline-flex"><div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="customCheck0"><label class="custom-control-label" for="customCheck0"></label></div><div class="checkbox-count-parent"><svg data-toggle="tooltip" title="Удалить" onclick="app.item.remove.checkbox()" class="icon ml-2" width="31" height="33" viewBox="0 0 31 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.42857 6.63635L5.96627 28.8402C6.03931 30.1232 7.07342 31.0606 8.42659 31.0606H22.5734C23.932 31.0606 24.9469 30.1232 25.0337 28.8402L26.5714 6.63635" stroke="#212529" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1.10714 6.63635H29.8929Z" fill="#212529"/><path d="M1.10714 6.63635H29.8929" stroke="#212529" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/><path d="M21.0357 10.8209L20.4206 26.3636M10.5794 6.38017V3.60469C10.5787 3.38582 10.6259 3.16898 10.7184 2.96665C10.8109 2.76432 10.9468 2.58049 11.1182 2.42572C11.2897 2.27096 11.4934 2.14832 11.7176 2.06486C11.9418 1.98139 12.1821 1.93876 12.4246 1.9394H18.5754C18.8179 1.93876 19.0582 1.98139 19.2824 2.06486C19.5066 2.14832 19.7103 2.27096 19.8818 2.42572C20.0533 2.58049 20.1891 2.76432 20.2816 2.96665C20.3741 3.16898 20.4213 3.38582 20.4206 3.60469V6.38017H10.5794ZM15.5 10.8209V26.3636V10.8209ZM9.96429 10.8209L10.5794 26.3636L9.96429 10.8209Z" stroke="#212529" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span checkbox-count class="checkbox-count-delete">0</span></div></div></th>');
            }

            $('#formModal [filter]').each(function () {
                if ($(this).attr('key')) {
                    var placeholder = $(this).attr('label'),
                        name_original = $(this).attr('key'),
                        name = name_original.replace('[', '').replace(']', ''),
                        input = app.item.html.text('string', name);
                } else {
                    var placeholder = $(this).find('label:eq(0)').text(),
                        input = $(this).find('[name]').clone(),
                        name_original = input.attr('name'),
                        name = name_original.replace('[', '').replace(']', '');
                }

                $('[table-items] thead tr').append('<th></th>');

                if (input.attr('type') == 'file') {
                    input = $('<select name="' + name + '"><option value="notnull">Есть</option><option value="null">Нет</option></select>');
                    input.val(app.GET(name));
                } else if (input[0].tagName == 'SELECT') {
                    if (input.find('option:selected').val() != '') {
                        input.find('option:selected').prop('selected', false);
                        input.prepend('<option selected value="">' + placeholder + '</option>');
                    }
                } else {
                    input = app.item.html.text('string', name, app.GET(name));
                }

                input.attr('placeholder', placeholder).addClass('form-control-sm');

                $('[table-items] thead th:eq(-1)').html(input);
            });
        }
    },

    GET: function (key) {
        var p = decodeURIComponent(window.location.search);
        p = p.match(new RegExp(key + '=([^&=]+)'));
        return p ? p[1] : '';
    },

    noty: function (type, text) {
        new Noty({
            type: type,
            text: text,
            timeout: 3500,
            progressBar: true
        }).show();
    },

    menu: function () {
        var menuItem = $('.nav a[href*="' + location.pathname + '"]:eq(0)');

        if (menuItem.parents('.dropdown').length) {
            menuItem.parents('.dropdown').find('a:eq(0)').addClass('active');
        } else {
            menuItem.addClass('active');
        }
    },

    summernote: function () {
        $('[summernote]').summernote({
            dialogsInBody: true,
            lang: 'ru-RU',
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'color', 'fontsize', 'fontsizeunit', 'height', 'clear']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['hr', 'table', 'picture', 'link', 'video']],
                ['view', ['codeview']]
            ],
            fontSizeUnits: ['pt', 'px', 'rem'],
            fontSizes: ['12', '14', '16', '18', '24', '36'],
            codeviewFilter: true
        });
    },

    tooltip: function () {
        $('[data-toggle="tooltip"]').tooltip();
    },

    preloader_show: false,
    preloader_elem: false,
    preloader: function (text) {
        if (text == 'close') {
            app.preloader_elem.close();
            app.preloader_show = false;
        } else {
            if (!app.preloader_show) {
                app.preloader_elem = new Noty({
                    type: 'info',
                    text: text
                }).show();
                app.preloader_show = true;
            }
        }
    },

    devEdit: function () {
        $(document)
            .on('paste', '[contenteditable]', function (e) {
                e.preventDefault();
                var text = e.originalEvent.clipboardData.getData('text/plain');

                if ($(this).attr('type') == 'string') {
                    text = text.replace(new RegExp("\\r?\\n", "g"), " ");
                }

                window.document.execCommand('insertText', false, text);
            })
            .on('input', '[contenteditable]', function () {
                if ($(this).html() === '<br>') {
                    $(this).html('');
                }
            });
    },

    textarea_autosize: {
        init: function () {
            app.textarea_autosize.resize($('[data-autosize]'));

            $(document).on('input', '[data-autosize]', function () {
                app.textarea_autosize.resize($(this));
            });

            document.addEventListener('DOMSubtreeModified', function () {
                app.textarea_autosize.resize($('[data-autosize]:not([data-autosize="true"])'));
            });
        },

        resize: function (elem) {
            if (elem && elem.length) {
                elem.each(function () {
                    $(this).css('height', 'auto').css('height', $(this)[0].scrollHeight + 'px');
                    if ($(this).attr('data-autosize') != 'true') {
                        $(this).attr('data-autosize', 'true');
                    }
                });
            }
        }
    }
}

app.init();