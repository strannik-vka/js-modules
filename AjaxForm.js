class AjaxForm {

    constructor(selector, callback) {
        this.selector = selector;
        this.callback = callback;

        this.submit();
    }

    submit() {
        $(document).on('submit', this.selector, (e) => {
            e.preventDefault();
            this.ajax($(e.currentTarget));
        });
    }

    options(form) {
        return {
            url: form.attr('action') ? form.attr('action') : location.href,
            type: form.attr('method') ? form.attr('method') : 'post',
            data: new FormData(form[0]),
            processData: false,
            contentType: false
        }
    }

    ajax(form) {
        ajax(this.options(form), response => {
            if (this.callback) {
                this.callback(response);
            }

            if (typeof modalNotify !== 'undefined') {
                modalNotify.create({
                    text: response.success
                });
            }

            if (response.success) {
                form.trigger('reset');

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