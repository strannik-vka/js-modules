if ($(window).width() < 767) {
    var previousScrollY = 0,
        modalToggle = function() {
            if ($('[class*="modal"][class*="show"]').length) {
                $('body').addClass('modal-open').css('padding-right', '8px');

                $('html').addClass('modal-open').css({
                    marginTop: -previousScrollY,
                    overflow: 'hidden',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    position: 'fixed',
                });
            } else {
                $('html').removeClass('modal-open').css({
                    marginTop: 0,
                    overflow: 'visible',
                    left: 'auto',
                    right: 'auto',
                    top: 'auto',
                    bottom: 'auto',
                    position: 'static',
                });
            }
        };

    $(document).on('shown.bs.modal', () => {
        previousScrollY = window.scrollY;
        modalToggle();
    }).on('hidden.bs.modal', () => {
        modalToggle();
        window.scrollTo(0, previousScrollY);
    });
}