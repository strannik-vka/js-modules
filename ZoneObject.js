/*
    ZoneObject.create('selector', {
        run: () => {

        },
        stop: () => {
            
        }
    });
*/

class ZoneObject {

    constructor() {
        this.elements = {};

        $(document).on('scroll', () => {
            this.scroll();
        });
    }

    scroll() {
        $.each(this.elements, (selector, data) => {
            this.check(selector, data);
        });
    }

    check(selector, data) {
        if (typeof data.maxWidth !== 'undefined') {
            if ($(window).width() > data.maxWidth) {
                return false;
            }
        }

        if (typeof data.minWidth !== 'undefined') {
            if ($(window).width() < data.minWidth) {
                return false;
            }
        }

        if ($(selector).length) {
            var wt = $(window).scrollTop(),
                wh = $(window).height();

            $(selector).each((i, item) => {
                if ($(item).is(':visible')) {
                    var et = $(item).offset().top,
                        eh = $(item).outerHeight();
                } else {
                    if ($(item).css('display') != 'none') {
                        return false;
                    }

                    if ($(item).prev('[data-object="' + selector + '"]').length == 0) {
                        $(item).before('<div style="visibility:hidden" data-object="' + selector + '"></div>');
                    }

                    var prev = $(item).prev('[data-object="' + selector + '"]');

                    var et = prev.offset().top,
                        eh = prev.outerHeight();
                }

                if (wt + wh >= et && wt + wh - eh * 2 <= et + (wh - eh)) {
                    if (data.active == false) {
                        this.elements[selector].active = true;
                        this.elements[selector].run($(selector));
                    }
                } else {
                    if (data.active == true) {
                        if (typeof this.elements[selector].stop === 'function') {
                            this.elements[selector].stop($(selector));
                            this.elements[selector].active = false;
                        }
                    }
                }
            });
        }
    }

    create(selector, obj) {
        var data = $.extend(obj, {
            active: false
        });

        this.elements[selector] = data;

        this.check(selector, data);
    }

}

export default new ZoneObject();