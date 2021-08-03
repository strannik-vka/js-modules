class SwiperAPI {

    constructor(selector) {
        this.selector = selector;
        this.swiper = document.querySelector(selector).swiper;
    }

    sync(selector) {
        const syncSwiper = document.querySelector(selector).swiper,
            slideTo = (index) => {
                this.swiper.slideTo(index);
                syncSwiper.slideTo(index);

                $(selector + ' .active').removeClass('active');
                $(this.selector + ' .active').removeClass('active');

                $(selector + ' .swiper-slide:eq(' + index + ') > *').addClass('active');
                $(this.selector + ' .swiper-slide:eq(' + index + ') > *').addClass('active');
            };

        $(selector + ' .swiper-slide').on('click', (e) => {
            slideTo($(e.currentTarget).index())
        });

        syncSwiper.on('slideChange', () => {
            slideTo(syncSwiper.activeIndex);
        });

        this.swiper.on('slideChange', () => {
            slideTo(this.swiper.activeIndex);
        });
    }

}

export default SwiperAPI;