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

        $.each(this.elements, (i, data) => {
            var et = $(data.element).offset().top,
                eh = $(data.element).outerHeight();

            if (wt + wh >= et && wt + wh - eh * 2 <= et + (wh - eh)) {
                if (data.active == false) {
                    this.elements[i].run();
                    this.elements[i].active = true;
                }
            } else {
                if (data.active == true) {
                    this.elements[i].stop();
                    this.elements[i].active = false;
                }
            }
        });
    }

    create(obj) {
        var index = Object.keys(this.elements).length;

        this.elements[index] = obj;
    }

}

export default new ZoneObject();