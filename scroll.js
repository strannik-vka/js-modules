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
            ), elem = scroll.elem(href);

            if (elem) {
                e.preventDefault();
                scroll.to(elem, function () {
                    location.hash = href;
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
            return $('#' + str).length ? $('#' + str)
                : (
                    $('a[name="' + str + '"]').length
                        ? $('a[name="' + str + '"]')
                        : false
                );
        }
        return false;
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
                if (callback) callback();
                elem.trigger('scroll-complete');
            });
        }
    }

}

scroll.init();