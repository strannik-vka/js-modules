$(document).on('show.bs.modal', () => {
    if ($('.tooltip.show').length) {
        $('.tooltip.show').tooltip('hide');
    }
});