let previousScrollY = 0;

$(document).on('shown.bs.modal', () => {
    previousScrollY = window.scrollY;
    $('html').addClass('modal-open').css({
        marginTop: -previousScrollY,
        overflow: 'hidden',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'fixed',
    });
}).on('hidden.bs.modal', () => {
    $('html').removeClass('modal-open').css({
        marginTop: 0,
        overflow: 'visible',
        left: 'auto',
        right: 'auto',
        top: 'auto',
        bottom: 'auto',
        position: 'static',
    });
    window.scrollTo(0, previousScrollY);
});