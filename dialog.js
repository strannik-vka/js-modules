require('./image.js');

window.dialog = {

    id: false,
    user: {
        id: false
    },

    selector: {
        message: {
            item: '[message-item]',
            list: '[message-list]',
            form: '[message-form]'
        },
        item: '[dialog-item]',
        list: '[dialog-list]'
    },

    init: function () {
        $(dialog.selector.message.list).on('scroll', function () {
            if (dialog.message.json.meta.last_page > dialog.message.page) {
                if ($(this).scrollTop() < 200 && !dialog.message.ajax_list) {
                    dialog.message.page++;
                    dialog.message.list({
                        page: dialog.message.page,
                        dialog_id: dialog.id,
                        user_id: dialog.user.id,
                    }, function (json) {
                        if (typeof json === 'object') {
                            json.prepend = true;
                        }
                        dialog.print(dialog.selector.message.list, json);
                    });
                }
            }
        });

        dialog.check_count();
    },

    count_old: 0,
    check_count: function () {
        dialog.count_new(false, function (count) {
            if (dialog.count_old != count) {
                if (dialog.count_old < count) {
                    dialog.list({
                        page: 1
                    }, function (json) {
                        $(dialog.selector.list).html('');

                        dialog.print(dialog.selector.list, json);

                        if (dialog.id || dialog.user.id) {
                            dialog.message.list({
                                user_id: dialog.user.id,
                                dialog_id: dialog.id,
                                page: 1
                            }, function (json) {
                                json.reverse = true;
                                json.count_new = true;

                                var count_new = dialog.print(dialog.selector.message.list, json);
                                dialog.count_old = count - count_new;

                                setTimeout(dialog.message.scroll, 0);
                                setTimeout(dialog.message.scroll, 1000);
                                setTimeout(dialog.check_count, 2000);
                            });
                        } else {
                            dialog.count_old = count;
                            setTimeout(dialog.check_count, 2000);
                        }
                    });
                } else {
                    dialog.count_old = count;
                    setTimeout(dialog.check_count, 2000);
                }
            } else {
                setTimeout(dialog.check_count, 2000);
            }
        });
    },

    message: {
        json: {
            meta: {
                last_page: 0
            }
        },
        page: 1,
        item: false,
        ajax_list: false,
        ajax_send: false,
        send: function (form, callback) {
            if (dialog.message.ajax_send || (!dialog.id && !dialog.user.id)) {
                return false;
            }

            dialog.message.ajax_send = true;

            if (dialog.id) {
                if (!form.find('[name="dialog_id"]').length) {
                    form.append('<input type="hidden" name="dialog_id">');
                }
                form.find('[name="dialog_id"]').val(dialog.id);
            }

            if (dialog.user.id) {
                if (!form.find('[name="user_id"]').length) {
                    form.append('<input type="hidden" name="user_id">');
                }
                form.find('[name="user_id"]').val(dialog.user.id);
            }

            var data = form[0] ? new FormData(form[0]) : form,
                setting = {
                    type: 'post',
                    url: '/dialog/send_message',
                    data: data,
                    dataType: 'json'
                };

            if (form[0]) {
                setting.processData = false;
                setting.contentType = false;
            }

            ajax(setting, function (json) {
                dialog.message.ajax_send = false;
                callback(json);
            }, (form[0] ? form : false));
        },
        list: function (obj, callback) {
            if (dialog.message.ajax_list || (!dialog.id && !dialog.user.id)) {
                return false;
            }

            dialog.message.ajax_list = true;

            if (obj.preloader) {
                $(dialog.selector.message.list).html(obj.preloader);
            }

            $(dialog.selector.item).removeClass('active');
            $('[dialog-id="' + obj.dialog_id + '"], [dialog-user-id="' + obj.user_id + '"]').addClass('active').find('[dialog-unread-count]').html('').hide();

            ajax({
                url: '/dialog/messages',
                data: obj
            }, function (json) {
                if (obj.preloader) {
                    $(dialog.selector.message.list).html('');
                }
                dialog.message.json = json;
                dialog.message.ajax_list = false;
                callback(json);
            });
        },
        scroll: function () {
            $(dialog.selector.message.list).scrollTop(99999999999);
        },
        short: function (text) {
            var message_short = text.substr(0, 19),
                message_short = message_short.length == text.length ? message_short : message_short + '..';
            return message_short;
        },
        attachs: function (data, html) {
            if (data && data.attach) {
                var result = '';
                if (typeof data.attach === 'object') {
                    $.each(data.attach, function (i, url) {
                        result += '<br><a href="' + url + '" target="_blank" download>Файл ' + (i + 1) + '</a>';
                    });
                } else {
                    result += '<br><a href="' + data.attach + '">Файл 1</a>';
                }
                if (result) {
                    html.find('[message-message]').append(result);
                }
            }
            return html;
        }
    },

    print: function (selector, json) {
        var count_new = 0;

        if (json && json.data && json.data.length) {
            var isDialog = (dialog.selector.list == selector ? true : false);

            if (json.reverse) {
                json.data = json.data.reverse();
            }

            $('[sending="true"], [dialog-empty]').remove();

            $.each(json.data, function (i, item) {
                var html = dialog.html(
                    (
                        isDialog
                            ? dialog.selector.item
                            : dialog.selector.message.item
                    ), item, (isDialog ? dialog.item : dialog.message.item)
                );

                if (html) {
                    if (json.prepend) {
                        $(selector).prepend(html);
                    } else {
                        if (json.count_new) {
                            count_new++;
                        }
                        $(selector).append(html);
                    }
                }
            });

            if (!json.prepend) {
                dialog.message.scroll();
            }
        }

        return count_new;
    },

    html: function (selector, data, obj) {
        if (!data) {
            return false;
        }

        var isDialog = (dialog.selector.item == selector ? true : false);

        if (isDialog) {
            if (data.dialog_id) {
                if ($('[dialog-id="' + data.dialog_id + '"]').length) {
                    return false;
                }
            } else {
                if ($('[dialog-user-id="' + data.id + '"]').length) {
                    return false;
                }
            }
        } else {
            if (
                (data.id && $('[message-id="' + data.id + '"]').length) ||
                ((dialog.id && data.dialog_id) && data.dialog_id != dialog.id)
            ) {
                return false;
            }
        }

        var html = $(selector + ':eq(0)').clone();

        $.each(obj, function (selector, val) {
            if (selector == 'function') {
                html = val(data, html);
            } else {
                html.find(selector).html(data[val]);
            }
        });

        if (isDialog) {
            if (data.dialog_id) {
                html.attr('dialog-id', data.dialog_id);
                if (dialog.id && dialog.id == data.dialog_id) {
                    html.addClass('active');
                }
            } else {
                html.attr('dialog-user-id', data.id);
                if (dialog.user.id && dialog.user.id == data.id) {
                    html.addClass('active');
                }
            }

            if (data.unread_count) {
                html.find('[dialog-unread-count]').html(data.unread_count).show();
            }
        } else {
            if (data.id) {
                html.attr('message-id', data.id);
            }

            html = dialog.message.attachs(data, html);
        }

        return html;
    },

    count_new: function (obj, callback) {
        ajax({
            url: '/dialog/count_new_messages',
            data: obj
        }, function (json) {
            callback(json && json.count ? json.count : 0);
        });
    },

    list: function (obj, callback) {
        ajax({
            url: '/dialog/list',
            data: obj
        }, function (json) {
            callback(json && json.data ? json : false);
        });
    },

    delete: function (obj, callback) {
        ajax({
            type: 'post',
            url: '/dialog/delete',
            data: obj
        }, function (json) {
            callback(json && json.success ? true : false);
        });
    },

    create: function (user_id, callback) {
        ajax({
            url: '/dialog/create',
            type: 'post',
            data: {
                user_id: user_id
            }
        }, function (json) {
            callback(json && json.id ? json : false);
        });
    }

}

dialog.init();