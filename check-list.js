$(document)
    .on('mousedown', '[data-bs-toggle="dropdown"]', (e) => {
        if ($(e.currentTarget).find('[disabled]').length) {
            $(e.currentTarget).dropdown('toggle');
            $('[aria-labelledby="' + $(e.currentTarget).attr('id') + '"]').hide();
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