window.scroller = {

    duration: 600,
    setTimeout: false,

    init: function () {
        if (location.hash) {
            window.onload = () => {
                scroller.onloadScroll();
            }
        }

        $(document)
            .on('click', '[scroll-top]', scroller.toTop)
            .on('click', '[href*="#"], [data-toggle="scroll"]', function (e) {
                if (scroller.allowed($(this))) {
                    var hash = scroller.elemHash($(this)), elem = scroller.elem(hash);

                    if (elem && elem.length) {
                        e.preventDefault();
                        scroller.to(elem);
                        location.hash = hash;
                        return false;
                    }
                }
            });
    },

    onloadScroll() {
        var hash = scroller.hash(location.href), elem = scroller.elem(hash);
        if (elem && elem.length) {
            scroller.to(elem);
        }
    },

    allowed: (elem) => {
        return ['collapse', 'tab', 'pill'].indexOf(elem.attr('data-toggle')) == -1;
    },

    hash: function (url) {
        url = url.split('#');
        url = url[url.length - 1];
        url = url.split('?');
        return url[0];
    },

    elemHash: (elem) => {
        return scroller.hash(
            elem.attr('href')
                ? elem.attr('href')
                : elem.attr('data-target')
        );
    },

    elem: function (str) {
        if (str && str.indexOf('://') == -1) {
            var isElem = $('*').is('#' + str);

            if (isElem) {
                if (
                    (
                        $('#' + str).css('display') == 'none' ||
                        $('#' + str).hasClass('modal')
                    ) && !$('#' + str).hasClass('tab-pane')
                ) {
                    return false;
                }
            }

            return isElem ?
                $('#' + str) :
                (
                    $('a').is('[name="' + str + '"]') ?
                        $('a[name="' + str + '"]') :
                        false
                );
        }

        return false;
    },

    getScrollTop: (elem, top) => {
        var scrollTop = elem.offset().top;

        if ($('html').attr('style') && $('html').attr('style').indexOf('zoom') > -1) {
            var zoom = parseFloat($('html').css('zoom'));
            scrollTop = ($(elem).offset().top - $(".header").height()) * zoom + $(window).scrollTop() * (1 - zoom);
        }

        $('[scroll-fixed]').each(function () {
            if ($(this).css('display') != 'none') {
                scrollTop -= parseFloat($(this).css('height'));
            }
        });

        if (top) {
            scrollTop += top;
        }

        if (elem.attr('data-top')) {
            scrollTop += parseInt(elem.attr('data-top'));
        }

        return scrollTop;
    },

    animate: (elem, top, callback) => {
        if (typeof ZoneObject !== 'undefined' && ZoneObject != null) {
            ZoneObject.off();
        }

        let scrollTop = scroller.getScrollTop(elem, top);

        $('html, body').stop().animate({
            'scrollTop': scrollTop
        }, scroller.duration);

        if (scroller.setTimeout) {
            clearTimeout(scroller.setTimeout);
        }

        scroller.setTimeout = setTimeout(() => {
            elem.trigger('scroll-complete');

            if (typeof ZoneObject !== 'undefined' && ZoneObject != null) {
                ZoneObject.on();
            }

            if (callback) callback();
        }, scroller.duration * 1.5);
    },

    to: function (elem, callback, top) {
        if (elem && elem.length) {
            if ($('.modal-open').length) {
                if ($('.modal').find(elem).length) {
                    return false;
                } else {
                    $('.modal-open').removeClass('modal-open');
                }
            }

            elem.trigger('scroll-start');

            if ($('[data-toggle="dropdown"]').length && typeof $.fn.dropdown !== 'undefined') {
                $('[data-toggle="dropdown"][aria-expanded="true"]').trigger('click');
            }

            setTimeout(() => {
                scroller.animate(elem, top, callback);
            }, elem.attr('data-timeout') ? parseFloat(elem.attr('data-timeout')) : 0);
        }
    },

    toTop: function () {
        scroller.to($('body'));
    }

}

$(scroller.init);