/*
    AjaxForm(selector, {
        beforeSubmit: (callback) => {}, // до отправки формы
        afterSubmit: (response) => {}, // ответ от сервера
        editMode: true // сначала нажимаем кнопку "редактировать" => появляется возможность сохранить,
        onChangeSubmit: true // после изменения в форме отправлять форму
        modalConfirm: selector // модалка подтверждения,
        beforeModalConfirm: function => {} // функция до вывода модалки подтверждения
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

        this.selector = selector;
        this.isEditMode = false;

        if (this.options.modalConfirm) {
            $(this.options.modalConfirm + ' form').on('submit', (e) => {
                e.preventDefault();
                this.submit($(this.selector));
            });
        }

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

    events() {
        $(document)
            .on('click', '[data-ajax-form-reset]', (e) => {
                this.reset($(e.currentTarget).parents('[data-ajax-form]'));
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

                if (this.options.modalConfirm) {
                    if (this.options.beforeModalConfirm) {
                        this.options.beforeModalConfirm();
                    }

                    $(this.options.modalConfirm).modal('show');
                } else {
                    this.submit($(e.currentTarget));
                }
            });
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

    htmlReset(form) {
        form.removeClass('success');

        var key = form.attr('data-ajax-form');

        if (key) {
            $('[data-ajax-form-show="' + key + '"]').hide();
            $('[data-ajax-form-hide="' + key + '"]').show();
        }

        form.find('[data-ajax-form-show]').hide();
        form.find('[data-ajax-form-hide]').show();
    }

    formData(form) {
        return {
            url: form.attr('action') ? form.attr('action') : location.href,
            type: form.attr('method') ? form.attr('method') : 'post',
            data: new FormData(form[0]),
            processData: false,
            contentType: false
        }
    }

    submit(form) {
        if (this.options.modalConfirm) {
            $(this.options.modalConfirm).modal('hide');
        }

        if (this.options.beforeSubmit) {
            this.options.beforeSubmit(submitAllow => {
                if (!submitAllow) {
                    return false;
                }
            });
        }

        if (this.isErrors(form)) {
            this.scrollToError();
        } else {
            var formData = this.formData(form);

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

                if (response.redirect) {
                    form.trigger('ajax-response-redirect');
                    location.href = response.redirect;
                } else if (response.success) {
                    form.trigger('ajax-response-success');

                    if (form.attr('data-goal-success')) {
                        if (typeof ym !== 'undefined') {
                            ym(66740038, 'reachGoal', form.attr('data-goal-success'));
                        }
                    }

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

                    var key = form.attr('data-ajax-form');

                    if (key) {
                        $('[data-ajax-form-show="' + key + '"]').show();
                        $('[data-ajax-form-hide="' + key + '"]').hide();
                    }

                    form.find('[data-ajax-form-show]').show();
                    form.find('[data-ajax-form-hide]').hide();

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

                form.trigger('ajax-response');
            }, form);
        }
    }

}

$(() => {
    $('[data-ajax-form]').each((index, form) => {
        let name = $(form).attr('data-ajax-form');

        if (name) {
            new AjaxForm('[data-ajax-form="' + name + '"]');
        } else {
            new AjaxForm('[data-ajax-form]:eq(' + index + ')');
        }
    });
});

export default AjaxForm;