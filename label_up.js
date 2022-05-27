class LabelUp {

    constructor() {
        this.selector = 'input[type="file"], input.form-control, input.form-type-text, textarea.form-type-text';

        $(document)
            .on('change', this.selector, (e) => {
                this.check($(e.currentTarget));
            })
            .on('focus', this.selector, (e) => {
                this.focus($(e.currentTarget));
            })
            .on('blur', this.selector, (e) => {
                this.check($(e.currentTarget));
            })
            .on('reset', 'form', (e) => {
                this.reset($(e.currentTarget));
            });

        this.each();
    }

    focus(elem) {
        var prev = elem.prev();

        if (prev.length) {
            if (prev[0].tagName == 'LABEL') {
                prev.addClass('label-up');
            }
        }
    }

    reset(form) {
        setTimeout(() => {
            this.each(form);
        }, 500);
    }

    each(form) {
        if (form) {
            form.find(this.selector).each((i, elem) => {
                this.check($(elem));
            });
        } else {
            $(this.selector).each((i, elem) => {
                this.check($(elem));
            });
        }
    }

    val(elem) {
        var val = $.trim(elem.val());

        if (val) {
            val = val.replace('__:__', '');
        }

        if (elem.attr('type') == 'file' && elem.attr('data-is-file') != undefined) {
            val = elem.attr('data-is-file');
        }

        if (elem.attr('type') == 'file') {
            let storageFile = elem.next().find('[data-storage-file]');
            if (storageFile.length && storageFile[0].tagName == 'A') {
                val = storageFile.attr('href');
            }
        }

        return $.trim(val);
    }

    check(elem) {
        var prev = elem.prev();

        if (prev.length) {
            if (prev[0].tagName == 'LABEL' && this.val(elem)) {
                prev.addClass('label-up');
            } else {
                prev.removeClass('label-up');
            }
        }
    }

}

new LabelUp();