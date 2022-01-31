class SwiperCounter {

    constructor(selector, obj) {
        obj = typeof obj === 'object' && obj != null ? obj : {};

        this.previousIndex = 0;
        this.selector = selector;
        this.breakpoints = obj.breakpoints;
        this.swiper = document.querySelector(selector).swiper;

        this.count = obj.count ? obj.count : 1;
        this.nextCount = obj.nextCount ? obj.nextCount : 1;
        this.total = obj.total;

        if (!obj.total) {
            this.total = this.getTotal();
        }

        this.setBreakpoints();
        this.setTotal();
        this.setCount();
        this.events();
    }

    restart() {
        this.setBreakpoints();
        this.setTotal();
        this.setCount();
    }

    setBreakpoints() {
        if (typeof this.breakpoints === 'object' && this.breakpoints != null) {
            var keys = Object.keys(this.breakpoints);

            keys.forEach(key => {
                if (window.screen.width >= key) {
                    var breakpointKeys = Object.keys(this.breakpoints[key]);
                    breakpointKeys.forEach(breakpointKey => {
                        this[breakpointKey] = this.breakpoints[key][breakpointKey];
                    });
                }
            });
        }
    }

    getTotal() {
        var aria_label = document.querySelector(this.selector + ' [aria-label]').getAttribute('aria-label'),
            aria_label_arr = aria_label.split('/');

        return parseInt(aria_label_arr[1]);
    }

    setCount() {
        document.querySelectorAll(this.selector).forEach(swiperElem => {
            swiperElem.querySelectorAll('[data-swiper-count]').forEach((countElem) => {
                countElem.innerHTML = this.count;
            });
        });

        document.querySelectorAll('[data-swiper-count="' + this.selector + '"]').forEach((countElem) => {
            countElem.innerHTML = this.count;
        });
    }

    setTotal() {
        document.querySelectorAll(this.selector).forEach(swiperElem => {
            swiperElem.querySelectorAll('[data-swiper-count-total]').forEach((countElem) => {
                countElem.innerHTML = this.total;
            });
        });

        document.querySelectorAll('[data-swiper-count-total="' + this.selector + '"]').forEach((countElem) => {
            countElem.innerHTML = this.total;
        });
    }

    events() {
        this.swiper.on('slideChange', (event) => {
            var isNext = (event.realIndex == this.previousIndex + 1) || (event.realIndex == 0 && this.total == this.previousIndex + 1);

            if (this.previousIndex != event.realIndex) {
                this.previousIndex = event.realIndex;

                if (isNext) {
                    this.count = this.count + this.nextCount;
                } else {
                    this.count = this.count - this.nextCount;
                }

                if (this.count > this.total) {
                    this.count = 1;
                }

                if (this.count <= 0) {
                    this.count = this.total;
                }

                this.setCount();
            }
        });

        $(window).on('resize', () => {
            this.restart();
        });
    }

}

export default SwiperCounter;