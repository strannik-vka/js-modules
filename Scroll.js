class Scroll {

    constructor() {
        this.viewElems = {};
    }

    horizontal(elem, obj) {
        elem = $(elem);
        obj = this._getObject({}, obj);

        elem.off('wheel').on('wheel', (e) => {
            var delta = e.originalEvent.deltaY !== 0 ? e.originalEvent.deltaY : e.originalEvent.deltaX,
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
            var timeout = elem.attr('data-timeout') ? parseFloat(elem.attr('data-timeout')) : 0,
                obj = this._getObject({
                    top: 0,
                    animate_time: 400
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
            }, timeout);
        }
    }

    viewOff(elem) {
        this.viewElems[elem].off = true;
    }

    viewOn(elem) {
        this.viewElems[elem].off = false;
    }

    view(elem, callback, obj) {
        obj = this._getObject({
            scroll: window
        }, obj);

        if (typeof this.viewElems[elem] === 'undefined') {
            this.viewElems[elem] = {
                status: null,
                off: false
            };

            $(obj.scroll).on('scroll', () => {
                if (this.viewElems[elem].off != true) {
                    var wt = $(obj.scroll).scrollTop(),
                        wh = $(obj.scroll).height(),
                        et = $(elem).offset().top,
                        eh = $(elem).outerHeight();

                    var isFull = et >= wt && et + eh <= wh + wt,
                        isShow = wt + wh >= et && wt + wh - eh * 2 <= et + (wh - eh),
                        result = isFull ? 'full' : (isShow ? 'show' : false);

                    if (result) {
                        if (this.viewElems[elem].status == null || this.viewElems[elem].status == false) {
                            callback(result);
                        }
                        this.viewElems[elem].status = true;
                    } else {
                        if (this.viewElems[elem].status == null || this.viewElems[elem].status == true) {
                            callback(false);
                        }
                        this.viewElems[elem].status = false;
                    }
                }
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

}

export default new Scroll();