class HorizontalView {

    constructor(obj) {
        this.section = obj.section ? obj.section : obj.content;
        this.sectionWrap = '[data-horizontal-section="' + this.section + '"]';
        this.content = obj.content;

        this.sticky();
        this.scroll();
    }

    scroll() {
        $(window)
            .on('scroll', () => {
                var top = $(this.sectionWrap).offset().top - $(window).scrollTop();

                $(this.content).css('transform', 'translateX(' + top + 'px)');
            });
    }

    sticky() {
        $(this.section).wrap('<div data-horizontal-section="' + this.section + '"></div>');

        var width = parseFloat($(this.content).css('width')),
            height = parseFloat($(this.sectionWrap).css('height'));

        $(this.sectionWrap).css({
            'position': 'relative',
            'height': (width + height) + 'px'
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