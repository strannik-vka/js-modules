window.scroller = {

    duration: 600,
    setTimeout: false,

    init: () => {
        if (location.hash) {
            scroller.onloadScroll((animate) => {
                if (animate) {
                    $(window).trigger('scroller.animate.end');
                } else {
                    setTimeout(() => {
                        $(window).trigger('scroller.animate.end');
                    }, scroller.duration);
                }
            });
        } else {
            setTimeout(() => {
                $(window).trigger('scroller.animate.end');
            }, scroller.duration);
        }

        $(document)
            .on('click', '[scroll-top]', scroller.toTop)
            .on('click', '[href*="#"], [data-toggle="scroll"]', function (e) {
                if (scroller.allowed($(this))) {
                    var hash = scroller.elemHash($(this)), elem = scroller.elem(hash);

                    if (elem && elem.length) {
                        e.preventDefault();
                        scroller.to(elem, () => {
                            scroller.setLocationHash(hash, elem);
                        });
                        return false;
                    }
                }
            });
    },

    setLocationHash: (hash, elem) => {
        scroller.replaceAttr(elem);
        location.hash = hash;
        scroller.replaceAttr(elem);
    },

    replaceAttr: (elem) => {
        if (elem.attr('name') || elem.attr('id')) {
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
        } else {
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
        }
    },

    onloadScroll: (callback) => {
        var hash = scroller.hash(decodeURIComponent(location.href)),
            elem = scroller.elem(hash);

        if (elem && elem.length) {
            scroller.to(elem, callback);
        } else {
            if (callback) {
                callback(false);
            }
        }
    },

    allowed: (elem) => {
        let result = ['collapse', 'tab', 'pill'].indexOf(elem.attr('data-toggle')) == -1;

        if (elem.attr('data-scroll-disabled')) {
            result = false;
        }

        return result;
    },

    hash: (url) => {
        let hash = url.split('#');

        hash = hash[hash.length - 1];
        hash = hash.split('?');
        hash = hash[0];
        hash = hash.replace(/[^a-zA-Z0-9_-]+/g, '');

        return hash;
    },

    elemHash: (elem) => {
        return scroller.hash(
            elem.attr('href')
                ? elem.attr('href')
                : elem.attr('data-target')
        );
    },

    elem: (str) => {
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
        let scrollTop = elem.offset().top,
            scrollCenter = elem.attr('data-scroll-center') != undefined;

        if ($('html').attr('style') && $('html').attr('style').indexOf('zoom') > -1) {
            var zoom = parseFloat($('html').css('zoom'));
            scrollTop = ($(elem).offset().top - $(".header").height()) * zoom + $(window).scrollTop() * (1 - zoom);
        }

        if (scrollCenter) {
            let windowHeight = $(window).height(),
                elemHeight = elem.height();

            if (windowHeight > elemHeight) {
                scrollTop -= (windowHeight - elemHeight) / 2;
            }
        } else {
            let fixedElemsHeight = 0;

            $('[scroll-fixed]').each(function () {
                if ($(this).css('display') != 'none') {
                    fixedElemsHeight += parseFloat($(this).css('height'));
                }
            });

            if (fixedElemsHeight) {
                scrollTop -= fixedElemsHeight;
            }
        }

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

            if (callback) {
                callback(true);
            }
        }, scroller.duration * 1.5);
    },

    to: (elem, callback, top) => {
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
        } else {
            if (callback) {
                callback(false);
            }
        }
    },

    toTop: () => {
        scroller.to($('body'));
    }

}

$(scroller.init);