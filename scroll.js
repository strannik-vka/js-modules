window.scroll = {

    first: false,

    init: function () {
        if (location.href.indexOf('#') > -1) {
            setTimeout(function () {
                scroll.to(scroll.elem(scroll.hash(location.href)));
            }, 100);
        }

        $(document).on('click', '[href*="#"], [data-toggle="scroll"]', function (e) {
            if ($(this).attr('data-toggle') == 'collapse') {
                return false;
            }

            var href = scroll.hash(
                $(this).attr('href')
                    ? $(this).attr('href')
                    : $(this).attr('data-target')
            ), elem = scroll.elem(href);

            if (elem && elem.length) {
                e.preventDefault();
                scroll.to(elem);
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
            if ($('#' + str).length) {
                if (
                    $('#' + str).css('display') == 'none' ||
                    $('#' + str).hasClass('modal')
                ) {
                    return false;
                }
            }

            return $('#' + str).length
                ? $('#' + str)
                : (
                    $('a[name="' + str + '"]').length
                        ? $('a[name="' + str + '"]')
                        : false
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

    to: function (elem, callback) {
        if (elem && elem.length) {
            if ($('.modal-open').length) {
                if ($('.modal').find(elem).length) {
                    return false;
                } else {
                    $('.modal-open').removeClass('modal-open');
                }
            }

            elem.trigger('scroll-start');

            scroll.replace_attr(elem);

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

            $('html, body').stop().animate({
                'scrollTop': scrollTop
            }, 400, 'swing', function () {
                elem.trigger('scroll-complete');
                if (callback) callback();
            });

            scroll.replace_attr(elem);
        }
    }

}

$(scroll.init);