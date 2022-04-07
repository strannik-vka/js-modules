$(document).on('change', '[data-check-list] [name]', (e) => {
    let val = null,
        id = $(e.currentTarget).parents('[data-check-list]').attr('data-check-list');

    let nextElem = $(e.currentTarget).next();
    if (nextElem[0].tagName == 'LABEL') {
        val = $.trim(nextElem.text());
    }

    $('[data-check-value="' + id + '"]').val(val).trigger('change');
});