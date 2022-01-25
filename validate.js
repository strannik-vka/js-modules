window.validate = {

    initOn: false,
    name: false, // текущий проверяемый name поля
    form: false, // текущая проверяемая форма

    list: {},

    valid_text: {
        required: 'Заполните это поле',
        max: {
            numeric: 'Не может быть более :max.',
            file: 'Размер файла превышает :max килобайт(а).',
            string: 'Сократите текст',
            array: 'Количество элементов не может превышать :max.'
        },
        min: {
            numeric: 'Должно быть не менее :min.',
            file: 'Размер файла должен быть не менее :min килобайт(а).',
            string: 'Количество символов должно быть не менее :min',
            array: 'Количество элементов должно быть не менее :min.',
        },
        email: 'Введите корректный электронный адрес',
        confirmed: 'Не совпадает с подтверждением',
        mimes: 'Неподдерживаемый тип файла'
    },

    valid: {
        required: function (input) {
            return $.trim(validate.helper.value(input));
        },
        email: function (input) {
            var pattern = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
            return pattern.exec(validate.helper.value(input));
        },
        max: function (input, max) {
            var length = validate.helper.length(input);
            return parseFloat(max) >= length;
        },
        min: function (input, min) {
            var length = validate.helper.length(input);
            return parseFloat(min) <= length;
        },
        confirmed: function (input) {
            var val1 = validate.helper.value(input),
                val2 = validate.helper.value(validate.form.find('[name="' + validate.name.replace('_confirmation', '') + '"]'));

            return val1 == val2;
        },
        mimes: function (input, mimes) {
            var types = validate.helper.file.types(input),
                result = false;

            $.each(types, function (index, type) {
                if (mimes.indexOf(type) == -1) {
                    result = type;
                    return false;
                }
            });

            return result == false;
        },
        getText: function (method, args, text, type, name) {
            var valid_text = validate.valid_text[method];

            if (typeof valid_text === 'object') {
                valid_text = valid_text[type];
            }

            if (typeof text === 'object' && text != null) {
                if (text[name + '.' + method]) {
                    valid_text = text[name + '.' + method];
                }
            }

            return valid_text.replace(':' + method, args[0]);
        }
    },

    helper: {
        type: function (input) {
            var type = 'string',
                elem_type = input.attr('data-type') ? input.attr('data-type') : input.attr('type');

            if (elem_type == 'file') {
                type = 'file';
            }

            if (elem_type == 'number') {
                type = 'numeric';
            }

            if (elem_type == 'array') {
                type = 'array';
            }

            return type;
        },
        file: {
            size: function (input) {
                var bytes = 0;

                if (typeof input[0].files !== 'undefined') {
                    $.each(input[0].files, function (index, file) {
                        bytes += file.size;
                    });
                }

                return bytes ? parseFloat((bytes / 1024).toFixed(3)) : bytes;
            },
            types: function (input) {
                var types = [];

                if (typeof input[0].files !== 'undefined') {
                    $.each(input[0].files, function (index, file) {
                        var arr = file.name.split('.');
                        types.push(arr[arr.length - 1]);
                    });
                }

                return types;
            }
        },
        length: function (input) {
            var length = false;

            if (input.attr('type') == 'file') {
                length = validate.helper.file.size(input);
            } else {
                length = $.trim(input.val()).replace(/\n/g, '\n\r').length
            }

            return length;
        },
        value: function (input) {
            if (input.attr('type') == 'radio') {
                input = validate.form.find('[name="' + input.attr('name') + '"]:checked');
            }

            return $.trim(input.val());
        },
        formGroup: function (elem) {
            return elem.closest('[data-valid-group], .form-group');
        },
        groupLabel: function (elem) {
            var formGroup = validate.helper.formGroup(elem);

            if (formGroup.length) {
                var label = formGroup.find('[data-valid-label]:eq(0)');

                return label.length ? label : formGroup.find('label:eq(0)');
            }

            return $();
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
            validate.name = name;

            var input = form.find('[name="' + name + '"]'),
                type = validate.helper.type(input),
                methods = methods.split('|');

            $.each(methods, function (i, method) {
                var args = method.split(':'),
                    method = args.splice(0, 1);

                var result = args.length
                    ? validate.valid[method](input, args[0])
                    : validate.valid[method](input);

                if (!result) {
                    if (!errors[name]) {
                        errors[name] = [];
                    }

                    var valid_text = validate.valid.getText(method, args, text, type, name);

                    if (valid_text) {
                        errors[name].push(valid_text);
                    }
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
            var el = $(this), visible = el.is(':visible');

            if (!visible) {
                el.before('<div data-tmp-visible></div>');
                el = $('[data-tmp-visible]');
            }

            offset = el.offset();

            if (scrollTop <= offset.top && (el.height() + offset.top) < (scrollTop + windowHeight)) { } else {
                result.push(this);
            }

            if (!visible) {
                el.remove();
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

            var groupLabel = validate.helper.groupLabel(error_elem);

            if (groupLabel.length) {
                groupLabel.addClass('invalid-label');
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

        var formGroup = validate.helper.formGroup($('[data-error-input="' + input.attr('name') + '"]'));

        if (formGroup.length) {
            formGroup.find('.invalid-label').removeClass('invalid-label');
        }

        $('[data-error-input="' + input.attr('name') + '"]').remove();
    },

    errors: function (response_errors, form) {
        if (!validate.initOn) validate.init();

        form = typeof form !== 'undefined' ? form : $('body');

        form.find('.is-invalid').each(function () {
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

        if (typeof scroller !== 'undefined') {
            if (form.find('.is-invalid').length) {
                if (validate.notSeen(form.find('.is-invalid:eq(0)')).length) {
                    scroller.to(form.find('.is-invalid:eq(0)'), false, -50);
                }
            }
        }
    }

}