class HorizontalView {

    constructor(obj) {
        this.section = obj.section ? obj.section : obj.content;
        this.height = obj.height ? obj.height : null;
        this.content = $(obj.content);
        this.width = obj.width ? obj.width : (parseFloat(this.content.css('width')) - $(window).width());
        this.onScrollPercent = obj.onScrollPercent;
        this.transform = typeof obj.transform !== 'undefined' ? obj.transform : true;

        $(window).on('resize', () => {
            this.width = obj.width ? obj.width : (parseFloat(this.content.css('width')) - $(window).width());
        });

        if ($(this.section).length) {
            this.sticky();
            this.scroll();
        }
    }

    scroll() {
        $(window)
            .on('scroll', () => {
                var top = this.sectionWrap.offset().top - $(window).scrollTop();

                if (this.transform) {
                    this.content.css('transform', 'translateX(' + top + 'px)');
                }

                if (this.onScrollPercent) {
                    this.onScrollPercent(100 / (this.width / -(top)));
                }
            });
    }

    sticky() {
        $(this.section).wrap('<div data-horizontal-section="' + this.section + '"></div>');

        this.sectionWrap = $('[data-horizontal-section="' + this.section + '"]');

        let height = this.height ? this.height : parseFloat(this.sectionWrap.css('height'));

        this.sectionWrap.css({
            'position': 'relative',
            'height': (this.width + height) + 'px'
        });

        $(this.section).css({
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        });
    }

}

export default HorizontalView;