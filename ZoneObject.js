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
        if ($(selector).length) {
            var wt = $(window).scrollTop(),
                wh = $(window).height();

            var et = $(selector).offset().top,
                eh = $(selector).outerHeight();

            if (wt + wh >= et && wt + wh - eh * 2 <= et + (wh - eh)) {
                if (data.active == false) {
                    this.elements[selector].active = true;
                    this.elements[selector].run($(selector));

                    if (location.href.indexOf('zone_debug') > -1) {
                        console.log(selector);
                    }
                }
            } else {
                if (data.active == true) {
                    if (typeof this.elements[selector].stop === 'function') {
                        this.elements[selector].stop($(selector));
                        this.elements[selector].active = false;
                    }
                }
            }
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