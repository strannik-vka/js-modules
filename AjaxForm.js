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
                this.submit($(e.currentTarget));
            });
    }

    reset(form) {
        form.trigger('reset').removeClass('success');

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
        ajax(this.formData(form), response => {
            if (this.callback) {
                this.callback(response);
            }

            if (typeof modalNotify !== 'undefined') {
                modalNotify.create({
                    text: response.success
                });
            }

            if (response.success) {
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
            }
        }, form);
    }

}

$(() => {
    new AjaxForm('[data-ajax-form]');
});

export default AjaxForm;