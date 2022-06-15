$(document)
    .on('click', '[data-ov-input]', (e) => {
        let inputElem = $(e.currentTarget),
            textElem = $('[data-ov-text="' + inputElem.attr('data-ov-input') + '"]');

        if (inputElem.prop('checked')) {
            setTimeout(() => {
                textElem.focus();
            }, 1000);
        }
    })
    .on('blur', '[data-ov-text]', (e) => {
        let textElem = $(e.currentTarget),
            inputElem = $('[data-ov-input="' + textElem.attr('data-ov-text') + '"]');

        if ($.trim(textElem.val()) == '') {
            inputElem.prop('checked', false);
        } else {
            inputElem.prop('checked', true);
        }
    })
    .on('click', '[data-ov-text]', (e) => {
        $('[data-ov-input="' + $(e.currentTarget).attr('data-ov-text') + '"]').prop('checked', true);
    })
    .on('input', '[data-ov-text]', (e) => {
        $('[data-ov-input="' + $(e.currentTarget).attr('data-ov-text') + '"]').val($(e.currentTarget).val());
    });