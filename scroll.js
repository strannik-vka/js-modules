window.scroll = {

    init: function () {
        if (location.href.indexOf('#') > -1) {
            setTimeout(function () {
                scroll.to(scroll.elem(scroll.hash(location.href)));
            }, 100);
        }

        $(document).on('click', '[href*="#"], [data-toggle="scroll"]', function (e) {
            var href = scroll.hash(
                $(this).attr('href')
                    ? $(this).attr('href')
                    : $(this).attr('data-target')
            ), elem = scroll.elem(href), this_elem = $(this);

            if (elem) {
                e.preventDefault();
                this_elem.trigger('scroll-start');
                scroll.to(elem, function () {
                    location.hash = href;
                    scroll.replace_attr(elem);
                    this_elem.trigger('scroll-complete');
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
            if (($('#' + str).length && $('#' + str).css('display') == 'none') || $('#' + str).hasClass('modal')) {
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
        } else if(elem.attr('id')) {
            elem
                .attr('data-id', elem.attr('id'))
                .removeAttr('id');
        } else if(elem.attr('data-id')) {
            elem
                .attr('id', elem.attr('data-id'))
                .removeAttr('data-id');
        } else if(elem.attr('data-name')) {
            elem
                .attr('name', elem.attr('data-name'))
                .removeAttr('data-name');
        }
    },

    to: function (elem, callback) {
        if (elem && elem.length) {
            if ($('[data-toggle="dropdown"]').length) {
                $('[data-toggle="dropdown"]').dropdown('hide');
            }

            var scrollTop = elem.offset().top;

            $('[scroll-fixed]').each(function () {
                if ($(this).css('display') != 'none') {
                    scrollTop -= parseFloat($(this).css('height'));
                }
            });

            $('html, body').stop().animate({
                'scrollTop': scrollTop
            }, 400, 'swing', function () {
                scroll.replace_attr(elem);
                if (callback) callback();
                elem.trigger('scroll-complete');
            });
        }
    }

}

scroll.init();