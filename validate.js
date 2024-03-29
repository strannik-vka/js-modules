window.validate = {

    initOn: false,
    name: false, // текущий проверяемый name поля
    form: false, // текущая проверяемая форма
    options: {},

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
        mimes: 'Неподдерживаемый тип файла',
        url: 'Введите корректную ссылку',
        domain: 'Введите корректный домен',
        source: 'Введите корректную ссылку',
        urlLight: 'Введите корректную ссылку',
    },

    valid: {
        source: (val) => {
            let valArr = val.split('/'),
                lastVal = $.trim(valArr[valArr.length - 1]);

            return val.indexOf('.') > -1 && val.indexOf('/') > -1 && lastVal;
        },
        urlLight: (val) => {
            return val.indexOf('.') > -1;
        },
        url: (val) => {
            try {
                new URL(val[i]);
                return val[i].indexOf('http://') > -1 || val[i].indexOf('https://') > -1;
            } catch (_) {
                return false;
            }
        },
        domain: (val) => {
            return val.match(new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/));
        },
        required: function (val) {
            return val;
        },
        email: function (val) {
            var pattern = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
            return pattern.exec(val);
        },
        max: function (val, input, max) {
            return parseFloat(max) >= validate.helper.length(input);
        },
        min: function (val, input, min) {
            return parseFloat(min) <= validate.helper.length(input);
        },
        confirmed: function (val) {
            return val == validate.helper.value(validate.form.find('[name="' + validate.name.replace('_confirmation', '') + '"]'));
        },
        mimes: function (val, input, mimes) {
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
                methods = methods.split('|'),
                val = $.trim(validate.helper.value(input));

            if (methods.indexOf('required') == -1 && !val) {
                return true;
            }

            let valArr = null;

            if (typeof validate.options.delimiter === 'object' && validate.options.delimiter != null) {
                if (validate.options.delimiter[validate.name]) {
                    valArr = val.split(validate.options.delimiter[validate.name]);
                }
            }

            valArr = Array.isArray(valArr) ? valArr : [val];

            for (let i = 0; i < valArr.length; i++) {
                methods.forEach(method => {
                    var args = method.split(':'),
                        method = args.splice(0, 1);

                    var result = args.length
                        ? validate.valid[method]($.trim(valArr[i]), input, args[0])
                        : validate.valid[method]($.trim(valArr[i]), input);

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
            }
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

            let offset = el.offset();

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
            .on('change', '[name][type="radio"], [name][type="checkbox"]', function () {
                let name = $(this).attr('name');

                if ($('[name="' + name + '"].is-invalid').length) {
                    validate.error_remove($('[name="' + name + '"].is-invalid'));
                }
            })
            .on('keyup change', '.is-invalid, .is-invalid *, .selectized', function () {
                let type = $(this).attr('type');

                if (type) {
                    if (['radio', 'checkbox'].indexOf(type) == -1) {
                        validate.error_remove($(this));
                    }
                }
            });
    },

    error: function (key, string, form) {
        if (!validate.initOn) validate.init();

        form = typeof form !== 'undefined' ? form : $('body');

        var error_elem = form.find('[name="' + key + '"]:eq(0)').length
            ? form.find('[name="' + key + '"]:eq(0)')
            : form.find('[name^="' + key + '["]:eq(0)');

        if (!error_elem.length && key.indexOf('.') > -1) {
            let strArr = key.split('.'),
                selector = strArr.map((str, index) => {
                    return index ? '[' + str + ']' : str;
                });

            selector = selector.join('');

            error_elem = form.find('[name="' + selector + ']"]:eq(0)');

            if ($('[data-valid-input="' + selector + '"]').length) {
                error_elem = $('[data-valid-input="' + selector + '"]');
            }
        } else {
            if ($('[data-valid-input="' + key + '"]').length) {
                error_elem = $('[data-valid-input="' + key + '"]');
            } else if ($('[data-valid-input^="' + key + '["]').length) {
                error_elem = $('[data-valid-input^="' + key + '["]');
            }
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

    errorInputElem: (input) => {
        let elem = $('[data-error-input="' + input.attr('name') + '"]');

        if (elem.length == 0) {
            elem = input.next('[data-error-input]');

            if (elem.length == 0) {
                elem = input.parents('[data-valid-group]').find('[data-error-input]');
            }
        }

        return elem;
    },

    error_remove: function (input) {
        input.removeClass('is-invalid');

        const errorInputElem = validate.errorInputElem(input);

        errorInputElem
            .parents('.is-invalid')
            .removeClass('is-invalid');

        var formGroup = validate.helper.formGroup(errorInputElem);

        if (formGroup.length) {
            formGroup.find('.invalid-label').removeClass('invalid-label');
        }

        errorInputElem.remove();
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

        validate.scrollToError(form);
    },

    dropdownShow: (elem) => {
        let parent = elem.parents('[aria-labelledby]');

        if (parent.length) {
            $('#' + parent.attr('aria-labelledby')).dropdown('show');
        }
    },

    scrollToError: (form) => {
        if (typeof scroller !== 'undefined') {
            if (form.find('.is-invalid').length) {
                let elem = form.find('.is-invalid:eq(0)');

                validate.dropdownShow(elem);

                if (validate.notSeen(elem).length) {
                    scroller.to(elem, false, -50);
                }
            }
        }
    },

    createTimeout: false,
    create: (formSelector, validObj, options) => {
        $.each(validObj, (name, valid) => {
            $(document).on('input blur', formSelector + ' [name="' + name + '"]', () => {
                let obj = {};

                obj[name] = valid;

                if (typeof options === 'object' && options != null) {
                    validate.options = options;
                }

                if (validate.checkTimeout) clearTimeout(validate.checkTimeout);
                validate.checkTimeout = setTimeout(() => {
                    validate.check($(formSelector), obj, true);
                }, 600);
            });
        });
    }

}