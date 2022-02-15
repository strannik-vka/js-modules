class AjaxForm {

    constructor(selector, callback) {
        this.selector = selector;
        this.callback = callback;

        this.events();
    }

    events() {
        $(document)
            .on('click', '[data-ajax-form-reset]', (e) => {
                this.reset($(e.currentTarget).parents('[data-ajax-form]'));
            })
            .on('submit', this.selector, (e) => {
                e.preventDefault();

                if (this.isErrors($(e.currentTarget))) {
                    this.scrollToError();
                } else {
                    this.submit($(e.currentTarget));
                }
            });
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
        var formData = this.formData(form);

        ajax(formData, response => {
            if (this.callback) {
                this.callback(response);
            }

            if (typeof response !== 'object') {
                if (formData.url.indexOf('login') > -1 || formData.url.indexOf('register') > -1 || formData.url.indexOf('forgot') > -1 || formData.url.indexOf('reset-password') > -1) {
                    var response = {
                        success: true
                    }
                }
            }

            if (response.redirect) {
                location.href = response.redirect;
            } else if (response.success) {
                if (typeof modalNotify !== 'undefined' && typeof response.success === 'string') {
                    modalNotify.create({
                        text: response.success
                    });
                }

                if (form.attr('data-ajax-form-reload')) {
                    location.reload();
                }

                if (form.attr('data-ajax-form-redirect')) {
                    location.href = form.attr('data-ajax-form-redirect');
                }

                form.addClass('success');

                if (form.find('[data-ajax-form-reset]').length == 0) {
                    form.trigger('reset');
                }

                var key = form.attr('data-ajax-form');

                if (key) {
                    $('[data-ajax-form-show="' + key + '"]').show();
                    $('[data-ajax-form-hide="' + key + '"]').hide();
                }

                form.find('[data-ajax-form-show]').show();
                form.find('[data-ajax-form-hide]').hide();
            } else {
                this.htmlReset(form);
            }

            form.trigger('ajax-response');
        }, form);
    }

}

$(() => {
    new AjaxForm('[data-ajax-form]');
});

export default AjaxForm;