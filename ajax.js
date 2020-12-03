window.ajax = function (obj, callback, form) {
    var settings = {
        headers: {}
    },
        token = localStorage.getItem('token'),
        preloader = 'Подождите..';

    if (token) {
        settings.headers.Authorization = 'Bearer ' + token;
    }

    if (typeof obj === 'object') {
        settings = Object.assign(settings, obj);

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

        if (button.length) {
            if (!button.attr('text')) {
                button.attr('text', button.html());
            }

            button
                .css('width', parseFloat(button.css('width')) + 'px')
                .html(preloader);
        }
    }

    $.ajax(settings).always(function (response) {
        if (form) {
            if (button.length) {
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

        callback(response, success);
    });
}

$(document).on('ajax.update', function () {
    ajax(location.href, function (html) {
        $('[ajax-elem]', html).each(function (index) {
            $('[ajax-elem]:eq(' + index + ')').before($(this).clone()).remove();
        });
        
        $(document).trigger('ajax.update.success');

        if (typeof webp !== 'undefined') {
            webp.init();
        }
    });
});