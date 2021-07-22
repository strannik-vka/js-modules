class Scroll {

    constructor() {
        this.viewElems = {};
    }

    replace_attr(elem) {
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

    to(elem, callback, top) {
        if (elem && elem.length) {
            var timeout = elem.attr('data-timeout') ? parseFloat(elem.attr('data-timeout')) : 0;

            setTimeout(() => {
                if ($('.modal-open').length) {
                    if ($('.modal').find(elem).length) {
                        return false;
                    } else {
                        $('.modal-open').removeClass('modal-open');
                    }
                }

                elem.trigger('scroll-start');

                this.replace_attr(elem);

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

                this.replace_attr(elem);
            }, timeout);
        }
    }

    viewOff(elem) {
        this.viewElems[elem].off = true;
    }

    viewOn(elem) {
        this.viewElems[elem].off = false;
    }

    view(obj) {
        if (typeof this.viewElems[obj.elem] === 'undefined') {
            this.viewElems[obj.elem] = {
                status: null,
                off: false
            };

            $(obj.scroll).on('scroll', () => {
                if (this.viewElems[obj.elem].off != true) {
                    var wt = $(obj.scroll).scrollTop(),
                        wh = $(obj.scroll).height(),
                        et = $(obj.elem).offset().top,
                        eh = $(obj.elem).outerHeight();

                    if (wt + wh >= et && wt + wh - eh * 2 <= et + (wh - eh)) {
                        if (this.viewElems[obj.elem].status == null || this.viewElems[obj.elem].status == false) {
                            obj.callback(true);
                        }
                        this.viewElems[obj.elem].status = true;
                    } else {
                        if (this.viewElems[obj.elem].status == null || this.viewElems[obj.elem].status == true) {
                            obj.callback(false);
                        }
                        this.viewElems[obj.elem].status = false;
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

}

export default Scroll;