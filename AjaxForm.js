/*
    AjaxForm(selector, {
        beforeSubmit: (callback) => {}, // до отправки формы
        afterSubmit: (response) => {}, // ответ от сервера
        editMode: true // сначала нажимаем кнопку "редактировать" => появляется возможность сохранить,
        onChangeSubmit: true // после изменения в форме отправлять форму
        modalConfirm: selector // модалка подтверждения,
        beforeModalConfirm: function => {} // функция до вывода модалки подтверждения,
        childForms: [ // дочерние формы
            {
                elem: $(elem),
                validUrl: $(form).attr('data-valid-url'),
                actionUrl: $(form).attr('action'),
                target: $(form).attr('data-target'),
                callback: () => {}
            }
        ]
    })
*/

class AjaxForm {

    constructor(selector, afterSubmit) {
        this.options = typeof afterSubmit === 'object' && afterSubmit != null ? afterSubmit : {
            afterSubmit: afterSubmit,
            onChangeSubmit: false
        }

        if (!this.options.modalConfirm && $(selector).attr('data-modal-confirm')) {
            this.options.modalConfirm = $(selector).attr('data-modal-confirm');
        }

        if ($(selector).attr('data-onchange-submit') == 'true') {
            this.options.onChangeSubmit = true;
        }

        if (typeof this.options.childForms === 'undefined') {
            this.options.childForms = [];
            $(selector).find('[data-child-form]').each((i, form) => {
                this.options.childForms.push({
                    elem: $(form),
                    validUrl: $(form).attr('data-valid-url'),
                    actionUrl: $(form).attr('action'),
                    target: $(form).attr('data-target')
                });
            });
        }

        this.selector = selector;
        this.isEditMode = false;
        this.modalConfirmEventsInit = false;

        this.events();
    }

    getActionId() {
        let action = $(this.selector).attr('action');

        if (action) {
            if (action.indexOf('/') > -1) {
                let actionArr = action.split('/');
                return actionArr[actionArr.length - 1];
            }
        }

        return null;
    }

    itemsHtmlUpdate(data) {
        let itemId = this.getActionId();

        if (typeof items !== 'undefined' && itemId) {
            let name = $(this.selector).attr('items-form');

            if (name) {
                items.htmlUpdate(
                    name,
                    $('[items-html-' + name + '="' + itemId + '"]'),
                    data
                );
            }
        }
    }

    modalConfirm() {
        if (this.options.modalConfirm) {
            return $(this.options.modalConfirm);
        }

        if ($(this.selector).attr('data-modal-confirm')) {
            return $($(this.selector).attr('data-modal-confirm'));
        }

        return $();
    }

    modalConfirmEvents() {
        if (this.modalConfirmEventsInit == false) {
            this.modalConfirmEventsInit = true;

            this.modalConfirm().find('form').on('submit', (e) => {
                e.preventDefault();
                this.submit($(this.selector));
            });
        }
    }

    events() {
        $(document)
            .on('click', '[data-ajax-form-reset]', (e) => {
                this.reset($(e.currentTarget).parents('[data-ajax-form]'));
            })
            .on('change', this.selector + ' [name]', (e) => {
                this.onChange(e);
            })
            .on('change', '[data-onchange-submit] [name]', () => {
                if (this.options.onChangeSubmit) {
                    $(this.selector).trigger('submit');
                }
            })
            .on('submit', this.selector, (e) => {
                e.preventDefault();

                let form = $(e.currentTarget),
                    btn = form.find('[type="submit"]'),
                    btnClass = btn.attr('class');

                if (btnClass) {
                    if (btn.attr('class').indexOf('deactive') > -1) {
                        return false;
                    }
                }

                if (form.attr('data-edit-mode') == 'true' || this.options.editMode) {
                    if (this.isEditMode == false) {
                        this.editModeOn(form);
                        return false;
                    }
                }

                if (this.modalConfirm().length) {
                    if (this.options.beforeModalConfirm) {
                        this.options.beforeModalConfirm();
                    }

                    this.modalConfirm().modal('show');
                    this.modalConfirmEvents();
                } else {
                    this.submit(form);
                }
            });
    }

    sendGoal(form, name) {
        if (form.attr('data-goal-id')) {
            if (typeof ym !== 'undefined') {
                ym(form.attr('data-goal-id'), 'reachGoal', name);
            }
        }
    }

    onChange(e) {
        let form = $(e.currentTarget).parents('form');

        if (form.attr('data-goal-start-fill') && !form.attr('data-goal-start-fill-send')) {
            form.attr('data-goal-start-fill-send', 'true');
            this.sendGoal(form, form.attr('data-goal-start-fill'));
        }
    }

    editModeOn(form) {
        this.isEditMode = true;

        form.find('[disabled]').each((i, input) => {
            if (!input.getAttribute('data-edit-mode-disabled')) {
                input.removeAttribute('disabled');
                input.setAttribute('data-edit-mode-enabled', 'true');
            }
        });

        let focusElem = form.find('[name][type="text"]:eq(0)');

        if (focusElem.length == 0) {
            focusElem = form.find('textarea[name]:eq(0)');
        }

        if (focusElem.length) {
            focusElem = focusElem[0];
            focusElem.focus();
            focusElem.setSelectionRange(focusElem.value.length, focusElem.value.length);
        }

        form.find('button').html('Сохранить');
    }

    editModeOff(form) {
        this.isEditMode = false;

        form.find('[data-edit-mode-enabled]').each((i, input) => {
            input.disabled = 'disabled';
        });

        form.find('button').html('Редактировать');
    }

    scrollToError() {
        if (typeof scroller !== 'undefined') {
            if ($('.is-invalid').length) {
                if (validate.notSeen($('.is-invalid:eq(0)')).length) {
                    scroller.to($('.is-invalid:eq(0)'), false, -50);
                }
            }
        }
    }

    isErrors(form) {
        return form.find('[data-error-input]').length;
    }

    reset(form) {
        form.trigger('reset');
        this.htmlReset(form);
    }

    elementsShowHide(form, reset) {
        let key = form.attr('data-ajax-form');

        const toggle = (element, show) => {
            let duration = parseFloat(element.attr('data-animate-duration'));

            if (duration) {
                element.removeClass('animate-finish-show animate-finish-hide');

                if (show) {
                    element.addClass('animate-process-show');
                } else {
                    element.addClass('animate-process-hide');
                }

                setTimeout(() => {
                    element.removeClass('animate-process-show animate-process-hide');

                    if (show) {
                        element.addClass('animate-finish-show');
                    } else {
                        element.addClass('animate-finish-hide');
                    }
                }, duration)
            } else {
                if (show) {
                    element.show();
                } else {
                    element.hide();
                }
            }
        }

        if (key) {
            $('[data-ajax-form-show="' + key + '"]').each((i, item) => {
                toggle($(item), !reset);
            })

            $('[data-ajax-form-hide="' + key + '"]').each((i, item) => {
                toggle($(item), reset);
            })
        }

        form.find('[data-ajax-form-show]').each((i, item) => {
            toggle($(item), !reset);
        })

        form.find('[data-ajax-form-hide]').each((i, item) => {
            toggle($(item), reset);
        })
    }

    htmlReset(form) {
        form.removeClass('success');

        this.elementsShowHide(form, true);

        form.find('progress').val('0').hide();
        form.find('.progress').hide().find('.progress-bar').css('width', '0');
    }

    formData(form) {
        let options = {
            url: form.attr('action') ? form.attr('action') : location.href,
            type: form.attr('method') ? form.attr('method') : 'post',
            data: new FormData(form[0]),
            processData: false,
            contentType: false
        }

        if (typeof ajaxFormPreloader !== 'undefined') {
            options.preloader_html = ajaxFormPreloader;
        }

        if (this.modalConfirm().length) {
            let formData = new FormData(this.modalConfirm().find('form')[0]);
            for (let item of formData.entries()) {
                options.data.append(item[0], item[1]);
            }
        }

        return options;
    }

    validChldrens(callback) {
        if (this.options.childForms.length) {
            setAjaxPreloader($(this.selector), '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only"></span></div>');

            let results = [], error = false, errors = false, serverError = false, isCallback = false;

            this.options.childForms.forEach(form => {
                let options = {
                    url: form.validUrl,
                    type: 'post',
                    data: new FormData(form.elem[0]),
                    processData: false,
                    contentType: false
                }

                options.success = response => {
                    if (response.error) {
                        error = response.error;
                    } else if (response.errors) {
                        errors = response.errors;
                    } else {
                        results.push(response);
                    }

                    if (form.callback) {
                        isCallback = true;
                        form.callback(response);
                    }
                }

                options.error = () => {
                    serverError = true;

                    if (form.callback) {
                        isCallback = true;
                        form.callback({
                            serverError: true
                        });
                    }
                }

                $.ajax(options);
            });

            this.validChldrensInterval = setInterval(() => {
                if (errors !== false || error !== false || serverError !== false) {
                    clearInterval(this.validChldrensInterval);
                    callback({
                        isCallback: isCallback,
                        error: error,
                        errors: errors,
                        serverError: serverError
                    });

                    delAjaxPreloader($(this.selector));
                } else if (results.length == this.options.childForms.length) {
                    clearInterval(this.validChldrensInterval);
                    callback(true);
                }
            }, 1000);
        } else {
            callback(true);
        }
    }

    submitChildrens(response, callback) {
        if (this.options.childForms.length && (response.redirect || response.success)) {
            setAjaxPreloader($(this.selector), '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only"></span></div>');

            let results = [];

            this.options.childForms.forEach(form => {
                $.ajax({
                    url: form.actionUrl,
                    type: 'post',
                    data: new FormData(form.elem[0]),
                    processData: false,
                    contentType: false
                }).always(() => {
                    results.push(true);
                });
            });

            this.validChldrensInterval = setInterval(() => {
                if (results.length == this.options.childForms.length) {
                    clearInterval(this.validChldrensInterval);
                    callback();
                }
            }, 1000);
        } else {
            callback();
        }
    }

    resetChildrens(response) {
        if (this.options.childForms.length && (response.redirect || response.success)) {
            this.options.childForms.forEach(form => {
                form.elem.trigger('reset').trigger('ajax-response-success');
            });
        }
    }

    submit(form) {
        if (this.modalConfirm().length) {
            this.modalConfirm().modal('hide');
        }

        const submit = () => {
            if (form.attr('data-ajax-process')) {
                return false;
            }

            form.attr('data-ajax-process', true);

            this.validChldrens(result => {
                if (result === true) {
                    if (this.isErrors(form)) {
                        form.removeAttr('data-ajax-process');
                        delAjaxPreloader(form);
                        this.scrollToError();
                    } else {
                        let formData = this.formData(form),
                            isProgressElem = form.find('progress').length || form.find('.progress').length > 0;

                        if (isProgressElem) {
                            formData.xhr = () => {
                                let xhr = new window.XMLHttpRequest();

                                xhr.upload.addEventListener('progress', function (evt) {
                                    if (evt.lengthComputable) {
                                        let percentComplete = evt.loaded / evt.total,
                                            progress = Math.round(percentComplete * 100);

                                        if (form.find('progress').length > 0) {
                                            form.find('progress').val(progress).show();
                                        }

                                        if (form.find('.progress').length > 0) {
                                            form.find('.progress').show();
                                            form.find('.progress-bar')
                                                .html(progress)
                                                .css('width', progress + '%')
                                                .attr('aria-valuenow', progress);
                                        }
                                    }
                                }, false);

                                return xhr;
                            }
                        }

                        ajax(formData, response => {
                            if (this.options.afterSubmit) {
                                this.options.afterSubmit(response);
                            }

                            if (typeof response !== 'object') {
                                if (formData.url.indexOf('login') > -1 || formData.url.indexOf('register') > -1 || formData.url.indexOf('forgot') > -1 || formData.url.indexOf('reset-password') > -1) {
                                    var response = {
                                        success: true
                                    }
                                }
                            }

                            this.submitChildrens(response, () => {
                                form.removeAttr('data-ajax-process');
                                delAjaxPreloader(form);

                                if (response.redirect) {
                                    form.trigger('ajax-response-redirect');

                                    if (form.attr('data-goal-success')) {
                                        this.sendGoal(form, form.attr('data-goal-success'));

                                        setTimeout(() => {
                                            location.href = response.redirect;
                                        }, 1000);
                                    } else {
                                        location.href = response.redirect;
                                    }
                                } else if (response.success) {
                                    if (form.attr('data-goal-success')) {
                                        this.sendGoal(form, form.attr('data-goal-success'));
                                    }

                                    if (response.data) {
                                        window.AjaxFormData = response.data;
                                    }

                                    form.trigger('ajax-response-success');

                                    if (typeof modalNotify !== 'undefined' && typeof response.success === 'string') {
                                        if (!response.text) {
                                            response.text = response.success;
                                        }

                                        modalNotify.create(response);
                                    }

                                    if (form.attr('data-ajax-form-reload')) {
                                        location.reload();
                                    }

                                    if (form.attr('data-ajax-form-redirect')) {
                                        location.href = form.attr('data-ajax-form-redirect');
                                    }

                                    form.addClass('success');

                                    if (form.find('[data-ajax-form-reset]').length == 0 && form.attr('data-reset') !== 'false') {
                                        this.reset(form);
                                    }

                                    this.elementsShowHide(form);

                                    if (form.attr('data-edit-mode') == 'true' || this.options.editMode) {
                                        if (this.isEditMode == true) {
                                            this.editModeOff(form);
                                        }
                                    }

                                    if (response && typeof response.data !== 'undefined') {
                                        this.itemsHtmlUpdate(response.data);
                                    }
                                } else {
                                    this.htmlReset(form);
                                }

                                this.resetChildrens(response);

                                form.trigger('ajax-response');
                            });
                        }, form);
                    }
                } else {
                    form.removeAttr('data-ajax-process');

                    if (typeof result.isCallback == false) {
                        if (result.error !== false) {
                            alert(result.error);
                        } else if (result.errors !== false) {
                            alert(JSON.stringify(result.errors));
                        } else {
                            alert('Оошибка сервера, попробуйте позже');
                        }
                    }
                }
            });
        }

        if (this.options.beforeSubmit) {
            this.options.beforeSubmit(submitAllow => {
                if (submitAllow) {
                    submit();
                }
            });
        } else {
            submit();
        }
    }

}

window.dataAjaxFormEach = () => {
    $('[data-ajax-form]').each((index, form) => {
        if (!$(form).attr('data-ajax-form-init')) {
            let name = $(form).attr('data-ajax-form');

            if (name) {
                new AjaxForm('[data-ajax-form="' + name + '"]');
            } else {
                new AjaxForm('[data-ajax-form]:eq(' + index + ')');
            }

            $(form).attr('data-ajax-form-init', true);
        }
    });
}

$(() => {
    window.dataAjaxFormEach();
});

export default AjaxForm;