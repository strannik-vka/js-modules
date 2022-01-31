class SwiperCounter {

    constructor(selector, obj) {
        this.activeIndex = 0;
        this.selector = selector;
        this.breakpoints = obj.breakpoints;
        this.swiper = document.querySelector(selector).swiper;

        this.count = obj.count ? obj.count : 1;
        this.nextCount = obj.nextCount ? obj.nextCount : 1;
        this.total = obj.total
            ? obj.total
            : document.querySelectorAll(selector + ' .swiper-slide').length;

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
            var isNext = event.activeIndex > this.activeIndex;

            this.activeIndex = event.activeIndex;

            if (isNext) {
                this.count = this.count + this.nextCount;
            } else {
                this.count = this.count - this.nextCount;
            }

            this.setCount();
        });

        $(window).on('resize', () => {
            this.restart();
        });
    }

}

export default SwiperCounter;