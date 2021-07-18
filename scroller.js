window.scroller = {

    first: false,

    init: function () {
        if (location.href.indexOf('#') > -1) {
            setTimeout(function () {
                scroller.to(scroller.elem(scroller.hash(location.href)));
            }, 100);
        }

        $(document)
            .on('click', '[scroll-top]', scroller.toTop)
            .on('click', '[href*="#"], [data-toggle="scroll"]', function (e) {
                if ($(this).attr('data-toggle') == 'collapse') {
                    return false;
                }

                var href = scroller.hash(
                    $(this).attr('href') ?
                        $(this).attr('href') :
                        $(this).attr('data-target')
                ),
                    elem = scroller.elem(href);

                if (elem && elem.length) {
                    e.preventDefault();
                    scroller.to(elem);
                    location.hash = href;
                    return false;
                }
            });
    },

    hash: function (url) {
        url = url.split('#');
        return url[url.length - 1];
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

    replace_attr: function (elem) {
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

    to: function (elem, callback, top) {
        if (elem && elem.length) {
            var timeout = elem.attr('data-timeout') ? parseFloat(elem.attr('data-timeout')) : 0;

            setTimeout(function () {
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

                $('html, body').stop().animate({
                    'scrollTop': scrollTop
                }, 400, 'swing', function () {
                    elem.trigger('scroll-complete');
                    if (callback) callback();
                });

                scroller.replace_attr(elem);
            }, timeout);
        }
    },

    toTop: function () {
        scroller.to($('body'));
    }

}

$(scroller.init);