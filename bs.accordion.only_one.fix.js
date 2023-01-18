// Чтобы открывался один collapse в .accordion-item

const selector = '[data-only-one]';

$(document)
    .on('shown.bs.collapse', selector + ' .collapse', (e) => {
        $(selector + ' [data-ac-toggle]').removeAttr('data-ac-toggle').attr('data-bs-toggle', 'collapse');
    })
    .on('click', selector + ' [data-bs-toggle="collapse"]', (e) => {
        $(selector + ' [data-bs-toggle]').removeAttr('data-bs-toggle').attr('data-ac-toggle', 'true');
    })
    .on('click', selector + ' [data-ac-toggle]', (e) => {
        if ($(selector + ' .collapse.show').length == 0 && $(selector + ' .collapsing').length == 0) {
            e.stopPropagation();
            $($(e.currentTarget).attr('data-bs-target')).collapse('toggle');
        }
    });