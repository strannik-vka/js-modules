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
        var wt = $(window).scrollTop(),
            wh = $(window).height();

        $.each(this.elements, (selector, data) => {
            var et = $(selector).offset().top,
                eh = $(selector).outerHeight();

            if (wt + wh >= et && wt + wh - eh * 2 <= et + (wh - eh)) {
                if (data.active == false) {
                    this.elements[selector].run($(selector));
                    this.elements[selector].active = true;
                }
            } else {
                if (data.active == true) {
                    this.elements[selector].stop($(selector));
                    this.elements[selector].active = false;
                }
            }
        });
    }

    create(selector, obj) {
        this.elements[selector] = $.extend(obj, {
            active: false
        });

        this.scroll();
    }

}

export default new ZoneObject();