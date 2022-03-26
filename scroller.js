window.scroller = {

    duration: 600,

    init: function () {
        if (location.href.indexOf('#') > -1) {
            let elem = scroller.elem(scroller.hash(location.href));
            scroller.replace_attr(elem);
            window.onload = () => {
                scroller.to(elem);
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

    replace_attr: function (elem, original) {
        if (original) {
            if (elem.attr('data-id')) {
                elem
                    .attr('id', elem.attr('data-id'))
                    .removeAttr('data-id');
            }

            if (elem.attr('data-name')) {
                elem
                    .attr('name', elem.attr('data-name'))
                    .removeAttr('data-name');
            }
        } else {
            if (elem.attr('name')) {
                elem
                    .attr('data-name', elem.attr('name'))
                    .removeAttr('name');
            }

            if (elem.attr('id')) {
                elem
                    .attr('data-id', elem.attr('id'))
                    .removeAttr('id');
            }
        }
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

        $('html, body').stop().animate({
            'scrollTop': scroller.getScrollTop(elem, top)
        }, {
            duration: scroller.duration
        });

        setTimeout(() => {
            scroller.replace_attr(elem, true);

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

            scroller.replace_attr(elem);

            if ($('[data-toggle="dropdown"]').length && typeof $.fn.dropdown !== 'undefined') {
                $('[data-toggle="dropdown"][aria-expanded="true"]').trigger('click');
            }

            setTimeout(() => {
                scroller.animate(elem, top, callback);
            }, elem.attr('data-timeout') ? parseFloat(elem.attr('data-timeout')) : 0);
        } else {
            scroller.replace_attr(elem, true);
        }
    },

    toTop: function () {
        scroller.to($('body'));
    }

}

$(scroller.init);