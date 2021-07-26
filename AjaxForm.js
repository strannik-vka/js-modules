class AjaxForm {

    constructor(selector, callback) {
        this.selector = selector;
        this.callback = callback;

        this.submit();
    }

    submit() {
        $(document).on('submit', this.selector, (e) => {
            e.preventDefault();
            this.ajax();
        });
    }

    options() {
        return {
            url: $(this.selector).attr('action') ? $(this.selector).attr('action') : location.href,
            type: $(this.selector).attr('method') ? $(this.selector).attr('method') : 'post',
            data: new FormData($(this.selector)[0]),
            processData: false,
            contentType: false
        }
    }

    ajax() {
        ajax(this.options(), response => {
            if (this.callback) {
                this.callback(response);
            }

            if (typeof modalNotify !== 'undefined') {
                modalNotify.create({
                    text: response.success
                });
            }
        }, $(this.selector));
    }

}

$(() => {
    new AjaxForm('[data-ajax-form]');
});

export default AjaxForm;