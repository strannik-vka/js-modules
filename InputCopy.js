class InputCopy {

    constructor(selector) {
        $(document).on('click', selector, this.click);
    }

    click = (e) => {
        let elem = $(e.currentTarget),
            inputSelector = elem.attr('data-input-copy'),
            input = $(inputSelector);

        if (inputSelector == 'prev') {
            input = elem.prev();
        } else if (inputSelector == 'next') {
            input = elem.next();
        }

        $('body').append('<input id="tmpCopy" type="text" value="' + input.val() + '" />');

        document.getElementById('tmpCopy').select();
        document.execCommand("copy");

        $('#tmpCopy').remove();

        if (typeof $.fn.tooltip !== 'undefined') {
            elem.attr({
                'data-title': 'Скопировано',
                'data-placement': elem.attr('data-placement') ? elem.attr('data-placement') : 'top',
                'data-trigger': 'manual'
            });

            elem.tooltip('show');

            setTimeout(() => {
                elem.tooltip('hide');
            }, 3000);
        }
    }

}

new InputCopy('[data-input-copy]');