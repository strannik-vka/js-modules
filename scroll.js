window.scroll = {

    first: false,

    init: function () {
        if (location.href.indexOf('#') > -1) {
            setTimeout(function () {
                var elem = scroll.elem(scroll.hash(location.href));
                if (elem && elem.length) {
                    scroll.replace_attr(elem);
                    scroll.to(elem, function () {
                        scroll.replace_attr(elem);
                        elem.trigger('scroll-complete');
                    });
                }
            }, 100);
        }

        $(document).on('click', '[href*="#"], [data-toggle="scroll"]', function (e) {
            var href = scroll.hash(
                $(this).attr('href')
                    ? $(this).attr('href')
                    : $(this).attr('data-target')
            ), elem = scroll.elem(href);

            if (elem && elem.length) {
                e.preventDefault();
                elem.trigger('scroll-start');
                scroll.to(elem, function () {
                    location.hash = href;
                    elem.trigger('scroll-complete');
                });
                return false;
            }
        });
    },

    hash: function (url) {
        url = url.split('#');
        return url[url.length - 1];
    },

    elem: function (str) {
        if (str) {
            if (
                ($('#' + str).length && $('#' + str).css('display') == 'none') ||
                $('#' + str).hasClass('modal')
            ) {
                return false;
            }

            return $('#' + str).length ? $('#' + str)
                : (
                    $('a[name="' + str + '"]').length
                        ? $('a[name="' + str + '"]')
                        : false
                );
        }
        return false;
    },

    replace_attr: function (elem) {
        if (elem.attr('name')) {
            elem
                .attr('data-name', elem.attr('name'))
                .removeAttr('name');
        } else if (elem.attr('id')) {
            elem
                .attr('data-id', elem.attr('id'))
                .removeAttr('id');
        } else if (elem.attr('data-id')) {
            elem
                .attr('id', elem.attr('data-id'))
                .removeAttr('data-id');
        } else if (elem.attr('data-name')) {
            elem
                .attr('name', elem.attr('data-name'))
                .removeAttr('data-name');
        }
    },

    to: function (elem, callback) {
        if ($('[data-toggle="dropdown"]').length) {
            $('[data-toggle="dropdown"]').dropdown('hide');
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
            if (callback) callback();
            elem.trigger('scroll-complete');
        });
    }

}

$(scroll.init);