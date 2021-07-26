window.ajaxProcess = false;

window.queue = {
    list: [],
    start: function () {
        if (queue.list.length) {
            var first = queue.list.splice(0, 1),
                first = first[0];
            ajax(first.obj, first.callback, first.form);
        }
    }
}

window.ajax = function (obj, callback, form) {
    if (ajaxProcess) {
        if (typeof obj === 'object') {
            if (obj.queue) {
                queue.list.push({
                    obj: obj,
                    callback: callback,
                    form: form
                });
            }
        }

        return false;
    }

    ajaxProcess = true;

    var settings = {
        headers: {}
    },
        token = localStorage.getItem('token'),
        preloader = '<div class="spinner-border w-50 h-50" role="status"><span class="sr-only">Loading...</span></div>';

    if (token) {
        settings.headers.Authorization = 'Bearer ' + token;
    }

    if (typeof obj === 'object') {
        settings = Object.assign(settings, obj);

        if (typeof obj.preloader_html !== 'undefined') {
            preloader = obj.preloader_html;
        }

        if (obj.preloader) {
            obj.preloader
                .css('height', parseFloat(obj.preloader.css('height')) + 'px')
                .html(preloader);
        }

        if (typeof obj.data === 'object') {
            if (!obj.data._token && typeof csrf_token !== 'undefined') {
                obj.data._token = csrf_token;
            }
        }
    } else {
        settings.url = obj;
    }

    if (form) {
        var button = form.find('button:eq(-1)');

        if (button.length && preloader) {
            if (!button.attr('text')) {
                button.attr('text', button.html());
            }

            button
                .css('min-width', parseFloat(button.css('width')) + 'px')
                .html(preloader);
        }
    }

    $.ajax(settings).always(function (response) {
        if (form) {
            if (button.length && preloader) {
                button.html(button.attr('text'));
                button.removeAttr('style');
            }
        }

        if (typeof obj === 'object') {
            if (obj.preloader) {
                obj.preloader
                    .removeAttr('style')
                    .html('');
            }
        }

        var success = true;

        if (response) {
            response = response.responseJSON ? response.responseJSON : response;

            if (response && response.errors) {
                if (typeof validate !== 'undefined') {
                    validate.errors(response.errors, form);
                }
                success = false;
            }
        }

        ajaxProcess = false;

        if (callback) callback(response, success);

        setTimeout(queue.start, 0);
    });
}

$(document).on('ajax.update', function () {
    ajax(location.href, function (html) {
        $('[ajax-elem]', html).each(function (index) {
            $('[ajax-elem]:eq(' + index + ')').before($(this).clone()).remove();
        });
        $(document).trigger('ajax.update.success');
    });
});