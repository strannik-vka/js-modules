// Масштабирование
function zoom() {
    if ($(window).width() > 1200 && $(window).width() < 1900) {
        var original = 1900, percent = 100 * (original - $(window).width()) / $(window).width();
        $('html').css('zoom', (100 - percent) + '%');
    } else if ($(window).width() > 1925) {
        var original = 1900, percent = 100 * ($(window).width() - original) / original;
        $('html').css('zoom', (100 + percent) + '%');
    } else {
        $('html').css('zoom', 'unset');
    }
    $('body').css('opacity', 1);
}

$(window).on('resize', zoom).trigger('resize');