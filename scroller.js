window.scroller = {

    first: false,

    init: function () {
        if (location.href.indexOf('#') > -1) {
            window.onload = () => {
                scroller.to(scroller.elem(scroller.hash(location.href)));
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
        return url[url.length - 1];
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

            var timeout = elem.attr('data-timeout') ? parseFloat(elem.attr('data-timeout')) : 0;

            setTimeout(() => {
                $('html, body').stop().animate({
                    'scrollTop': scrollTop
                }, 400, () => {
                    scroller.replace_attr(elem, true);

                    elem.trigger('scroll-complete');

                    if (callback) callback();
                });
            }, timeout);
        }
    },

    toTop: function () {
        scroller.to($('body'));
    }

}

$(scroller.init);