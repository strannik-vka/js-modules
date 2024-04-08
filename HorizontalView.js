class HorizontalView {

    constructor(obj) {
        this.obj = obj;
        this.section = obj.section ? obj.section : obj.content;
        this.height = typeof obj.height === 'number' ? obj.height : null;
        this.content = $(obj.content);
        this.width = typeof obj.width === 'number' ? obj.width : (
            parseFloat(this.content.css('width')) - $(window).width()
        );
        this.onScrollPercent = obj.onScrollPercent;
        this.transform = typeof obj.transform !== 'undefined' ? obj.transform : true;

        if ($(this.section).length) {
            this.sticky();
            this.on();
        }
    }

    onResize = () => {
        this.width = typeof this.obj.width === 'number' ? this.obj.width : (
            parseFloat(this.content.css('width')) - $(window).width()
        );
    }

    onScroll = () => {
        var elementTop = this.sectionWrap.offset().top, // расстояние от элемента до начала document
            scrollTop = $(window).scrollTop(), // сколько просколили
            translateX = elementTop - scrollTop; // смещение по translateX

        console.log(elementTop, scrollTop, translateX);

        if (this.transform) {
            this.content.css('transform', 'translateX(' + translateX + 'px)');
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

            let height = this.height ? this.height : parseFloat(this.sectionWrap.css('width'));

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