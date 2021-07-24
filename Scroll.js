class Scroll {

    constructor() {
        this.distanceElems = {};
    }

    horizontal(elem, obj) {
        elem = $(elem);
        obj = this._getObject({}, obj);

        elem.off('wheel').on('wheel', (e) => {
            var delta = this._getDelta(e),
                scrollLeft = elem.scrollLeft(),
                newScrollLeft = scrollLeft + delta;

            elem.scrollLeft(newScrollLeft);

            if (obj.onStart) {
                if (newScrollLeft < 0) {
                    obj.onStart(-delta);
                }
            }

            if (obj.onEnd) {
                if (this.isEndHorizontal(elem)) {
                    obj.onEnd(delta);
                }
            }

            e.preventDefault();
        });
    }

    to(elem, callback, obj) {
        elem = $(elem);

        if (typeof callback === 'object' && callback != null) {
            obj = callback;
            callback = false;
        }

        if (elem && elem.length) {
            obj = this._getObject({
                top: 0,
                animate_time: 400,
                timeout: elem.attr('data-timeout') ? parseFloat(elem.attr('data-timeout')) : 0
            }, obj);

            setTimeout(() => {
                if ($('.modal-open').length) {
                    if ($('.modal').find(elem).length) {
                        return false;
                    } else {
                        $('.modal-open').removeClass('modal-open');
                    }
                }

                elem.trigger('scroll-start');

                this._replaceAttr(elem);

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

                if (obj.top) {
                    scrollTop += obj.top;
                }

                $('html, body').stop().animate({
                    'scrollTop': scrollTop
                }, obj.animate_time, 'swing', function () {
                    elem.trigger('scroll-complete');

                    if (callback) callback();
                });

                this._replaceAttr(elem);
            }, obj.timeout);
        }
    }

    distance(elem, callback, obj) {
        obj = this._getObject({
            scroll: window
        }, obj);

        if (typeof this.distanceElems[elem] === 'undefined') {
            this.distanceElems[elem] = $(obj.scroll).scrollTop();

            $(obj.scroll)
                .on('scroll', () => {
                    var up = this.distanceElems[elem] > $(obj.scroll).scrollTop(),
                        top = $(elem).offset().top - this.distanceElems[elem];

                    callback({
                        top: top,
                        percent: {
                            top: 100 / ($(obj.scroll).height() / top)
                        },
                        up: up,
                        down: !up
                    });

                    this.distanceElems[elem] = $(obj.scroll).scrollTop();
                });
        }
    }

    enabled(elem) {
        $(elem).css('overflow', 'auto');
    }

    disabled(elem) {
        $(elem).css('overflow', 'hidden');
    }

    isEndHorizontal(elem) {
        return elem[0].$
            ? Math.round($(window).width() + $(window).scrollLeft()) >= $(document).width()
            : Math.round(elem.width() + elem.scrollLeft()) >= elem[0].scrollWidth;
    }

    isEnd(elem) {
        if (typeof elem === 'object') {
            return $(window).height() + $(window).scrollTop() >= ($(document).height());
        }

        return elem.height() + elem.scrollTop() >= elem[0].scrollHeight;
    }

    _replaceAttr(elem) {
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
    }

    _getObject(default_obj, obj) {
        return obj = typeof obj === 'object' && obj != null ? $.extend(default_obj, obj) : default_obj;
    }

    _getDelta(e) {
        return e.originalEvent.deltaY !== 0 ? e.originalEvent.deltaY : e.originalEvent.deltaX;
    }

}

export default new Scroll();