$(document)
    .on('mousedown', '[data-bs-toggle="dropdown"]', (e) => {
        let labelledbyElem = $('[aria-labelledby="' + $(e.currentTarget).attr('id') + '"]');

        if ($(e.currentTarget).find('[disabled]').length) {
            $(e.currentTarget).dropdown('toggle');
            labelledbyElem.hide();
        } else {
            if (labelledbyElem.attr('style')) {
                if (labelledbyElem.attr('style').indexOf('display: none') > -1) {
                    labelledbyElem.removeAttr('style');
                }
            }
        }
    })
    .on('change', '[data-check-list] [name]', (e) => {
        let val = null,
            id = $(e.currentTarget).parents('[data-check-list]').attr('data-check-list');

        let nextElem = $(e.currentTarget).next();
        if (nextElem[0].tagName == 'LABEL') {
            val = $.trim(nextElem.text());
        }

        $('[data-check-value="' + id + '"]').val(val).trigger('change');
    });