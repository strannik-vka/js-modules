window.validate = {

    initOn: false,
    name: false, // текущий проверяемый name поля
    form: false, // текущая проверяемая форма

    list: {},

    valid_text: {
        required: 'Заполните это поле',
        max: 'Сократите текст',
        min: 'Количество символов должно быть не менее :min',
        email: 'Введите корректный электронный адрес',
        confirmed: 'Не совпадает с подтверждением'
    },

    valid: {
        required: function (value) {
            return $.trim(value);
        },
        email: function (value) {
            var pattern = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
            return pattern.exec(value);
        },
        max: function (value, max) {
            var length = validate.helper.length(value);
            return parseFloat(max) >= length;
        },
        min: function (value, min) {
            var length = validate.helper.length(value);
            return parseFloat(min) <= length;
        },
        confirmed: function (value) {
            var value2 = validate.helper.value(validate.name.replace('_confirmation', ''), validate.form);
            return value == value2;
        }
    },

    helper: {
        length: function (value) {
            return $.trim(value).replace(/\n/g, '\n\r').length;
        },
        value: function (name, form) {
            var elem = form.find('[name="' + name + '"]');

            if (elem.attr('type') == 'radio') {
                elem = form.find('[name="' + name + '"]:checked');
            }

            return $.trim(elem.val());
        }
    },

    checkTimeout: false,
    check: function (form, obj, text, errorsView) {
        if (typeof text !== 'object' && text === true) {
            text = false;
            errorsView = true;
        }

        var errors = {};

        $.each(obj, function (name, methods) {
            validate.form = form;

            var value = validate.helper.value(name, form),
                methods = methods.split('|');

            $.each(methods, function (i, method) {
                validate.name = name;

                var args = method.split(':'),
                    method = args.splice(0, 1);

                var result = args.length
                    ? validate.valid[method](value, args[0])
                    : validate.valid[method](value);

                if (!result) {
                    if (!errors[name]) {
                        errors[name] = [];
                    }

                    var valid_text = validate.valid_text[method];

                    if (typeof text === 'object' && text != null) {
                        if (text[name + '.' + method]) {
                            valid_text = text[name + '.' + method];
                        }
                    }

                    valid_text = valid_text.replace(':' + method, args[0]);

                    errors[name].push(valid_text);
                }
            });
        });

        if (errorsView) {
            if (validate.checkTimeout) clearTimeout(validate.checkTimeout);
            validate.checkTimeout = setTimeout(function () {
                validate.errors(errors, form);
            }, 100);
        }

        return errors;
    },

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

        $(document)
            .on('keyup change', '.is-invalid, .is-invalid *, .selectized', function () {
                validate.error_remove($(this));
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
                .after('<div data-error-input="' + key + '" class="invalid-feedback">' + (typeof string === 'object' ? string[0] : string) + '</div>');

            if (error_elem.parents('.form-group').length) {
                error_elem.parents('.form-group').find('label:eq(0)').addClass('invalid-label');
            }

            return true;
        } else {
            return false;
        }
    },

    error_remove: function (input) {
        input.removeClass('is-invalid');

        $('[data-error-input="' + input.attr('name') + '"]')
            .parents('.is-invalid')
            .removeClass('is-invalid');

        if ($('[data-error-input="' + input.attr('name') + '"]').parents('.form-group').length) {
            $('[data-error-input="' + input.attr('name') + '"]').parents('.form-group').find('.invalid-label').removeClass('invalid-label');
        }

        $('[data-error-input="' + input.attr('name') + '"]').remove();
    },

    errors: function (response_errors, form) {
        if (!validate.initOn) validate.init();

        $('.is-invalid').each(function () {
            validate.error_remove($(this));
        });

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