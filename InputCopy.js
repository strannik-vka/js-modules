class InputCopy {

    constructor(selector) {
        $(document).on('click', selector, this.click);
    }

    tooltipShow = (elem, callback) => {
        elem.tooltip({
            title: 'Скопировано',
            placement: elem.attr('data-placement') ? elem.attr('data-placement') : 'top',
            trigger: 'manual'
        });
        elem.tooltip('show');

        setTimeout(() => {
            elem.one('hidden.bs.tooltip', function () {
                elem.tooltip('dispose');
            })

            elem.tooltip('hide');

            if (callback) {
                callback();
            }
        }, 3000);
    }

    click = (e) => {
        let elem = $(e.currentTarget),
            inputSelector = elem.attr('data-input-copy'),
            input = inputSelector ? $(inputSelector) : elem;

        if (inputSelector == 'prev') {
            input = elem.prev();
        } else if (inputSelector == 'next') {
            input = elem.next();
        }

        $('body').append('<textarea id="tmpCopy">' + (input.attr('name') ? input.val() : input.text()) + '</textarea>');

        document.getElementById('tmpCopy').select();
        document.execCommand("copy");

        $('#tmpCopy').remove();

        if (typeof $.fn.tooltip !== 'undefined') {
            try {
                if (elem.closest('.dropdown').length) {
                    this.tooltipShow(elem.closest('.dropdown'));
                } else if (elem.attr('data-toggle') == 'tooltip') {
                    if (elem.closest('#temp_tooltip').length == 0) {
                        var newElem = $('<span id="temp_tooltip"/>').css("display", "inline-block");

                        elem.wrap(newElem);
                        elem.tooltip('hide');

                        this.tooltipShow($('#temp_tooltip'), () => {
                            elem.unwrap();
                        });
                    }
                } else {
                    this.tooltipShow(elem);
                }
            } catch (e) { }
        }
    }

}

new InputCopy('[data-input-copy]');