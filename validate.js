window.validate = {

    initOn: false,

    notSeen: function (s) {
        var scrollTop = $(window).scrollTop(),
            windowHeight = $(window).height(),
            currentEls = $(s),
            result = [];

        currentEls.each(function () {
            var el = $(this), offset = el.offset();

            if (scrollTop <= offset.top && (el.height() + offset.top) < (scrollTop + windowHeight)) { } else {
                result.push(this);
            }
        });

        return $(result);
    },

    init: function () {
        validate.initOn = true;
        $(document).on('keyup change', '.is-invalid, .is-invalid *, .selectized', function () {
            $(this).removeClass('is-invalid');

            $('[data-error-input="' + $(this).attr('name') + '"]')
                .parents('.is-invalid')
                .removeClass('is-invalid');

            if ($('[data-error-input="' + $(this).attr('name') + '"]').parents('.form-group').length) {
                $('[data-error-input="' + $(this).attr('name') + '"]').parents('.form-group').find('.invalid-label').removeClass('invalid-label');
            }

            $('[data-error-input="' + $(this).attr('name') + '"]').remove();
        });
    },

    error: function (key, string, form) {
        if (!validate.initOn) validate.init();

        form = typeof form !== 'undefined' ? form : $('body');

        var error_elem = form.find('[name="' + key + '"]:eq(0)').length
            ? form.find('[name="' + key + '"]:eq(0)')
            : form.find('[name^="' + key + '["]:eq(0)');

        if (!error_elem.length && key.indexOf('.') > -1) {
            var str_arr = key.split('.');
            error_elem = form.find('[name="' + str_arr[0] + '[' + str_arr[1] + ']"]:eq(0)');
        }

        if ($('[data-valid-input="' + key + '"]').length) {
            error_elem = $('[data-valid-input="' + key + '"]');
        }

        if (error_elem.length) {
            $('[data-error-input="' + key + '"]').remove();
            error_elem
                .addClass('is-invalid')
                .after('<div data-error-input="' + key + '" class="invalid-feedback">' + (typeof string === 'object' ? string.join('<br>') : string) + '</div>');

            if (error_elem.parents('.form-group').length) {
                error_elem.parents('.form-group').find('label:eq(0)').addClass('invalid-label');
            }

            return true;
        } else {
            return false;
        }
    },

    errors: function (response_errors, form) {
        if (!validate.initOn) validate.init();

        var errors = [];

        $.each(response_errors, function (key, val) {
            if (!validate.error(key, val, form)) {
                errors.push(val);
            }
        });

        if (errors.length) {
            alert(errors.join(', '));
        }

        if ($('.is-invalid').length) {
            if (typeof scroll !== 'undefined') {
                if (validate.notSeen($('.is-invalid:eq(0)')).length) {
                    scroll.to($('.is-invalid:eq(0)'));
                }
            }
        }
    }

}