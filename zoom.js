// Масштабирование
function zoom() {
    if ($(window).width() > 1200 && $(window).width() < 1900) {
        var original = 1900, percent = ((original - $(window).width()) / ((original + $(window).width()) / 2)) * 100;
        $('html').css('zoom', (100 - (percent - 5)) + '%');
    }

    if ($(window).width() > 1925) {
        var original = 1900, percent = (($(window).width() - original) / ((original + $(window).width()) / 2)) * 100;
        $('html').css('zoom', (100 + percent) + '%');
    }
}

$(window).on('resize', zoom).trigger('resize');