class HorizontalView {

    constructor(obj) {
        this.section = obj.section ? obj.section : obj.content;
        this.height = obj.height ? obj.height : null;
        this.content = $(obj.content);
        this.width = obj.width ? obj.width : (parseFloat(this.content.css('width')) - $(window).width());
        this.onScrollPercent = obj.onScrollPercent;
        this.transform = typeof obj.transform !== 'undefined' ? obj.transform : true;

        if ($(this.section).length) {
            this.sticky();
            this.on();
        }
    }

    onResize = () => {
        this.width = obj.width ? obj.width : (parseFloat(this.content.css('width')) - $(window).width());
    }

    onScroll = () => {
        var top = this.sectionWrap.offset().top - $(window).scrollTop();

        if (this.transform) {
            this.content.css('transform', 'translateX(' + top + 'px)');
        }

        if (this.onScrollPercent) {
            this.onScrollPercent(100 / (this.width / -(top)));
        }
    }

    on() {
        $(window).on('resize', this.onResize);
        $(window).on('scroll', this.onScroll);
    }

    off() {
        $(window).off('resize', this.onResize);
        $(window).off('scroll', this.onScroll);
    }

    sticky() {
        if ($('[data-horizontal-section="' + this.section + '"]').length == 0) {
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

}

export default HorizontalView;