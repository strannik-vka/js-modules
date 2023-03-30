class FixedElement {

    constructor(selector) {
        this.selector = selector;

        this.onScrollSections = {};
        this.scrollTopLast = $(window).scrollTop();

        this.onScroll();
    }

    destroy() {
        $(window).off('scroll', this.scrollEvent);
    }

    onScroll() {
        $(window).on('scroll', this.scrollEvent);
    }

    scrollEvent = () => {
        $.each(this.onScrollSections, (sectionSelector, options) => {
            let isOverSection = this.isOverSection(sectionSelector),
                currentState = this.onScrollSections[sectionSelector];

            if (currentState.isOverSection != isOverSection) {
                this.onScrollSections[sectionSelector].isOverSection = isOverSection;
                options.callback(isOverSection);
            }
        });
    }

    isOverSection(sectionSelector) {
        let result = null;

        $(sectionSelector).each((i, elem) => {
            let sectionTop = $(elem).offset().top - $(window).scrollTop(),
                sectionBottom = sectionTop + parseInt($(elem).css('height')),
                elementTop = $(this.selector).offset().top - $(window).scrollTop(),
                elementBottom = elementTop + parseInt($(this.selector).css('height')),
                isOverSection = sectionTop < elementBottom && sectionBottom > elementTop;

            if (isOverSection) {
                result = isOverSection;
                return false;
            }
        });

        return result;
    }

    onOverSection(sectionSelector, callback) {
        this.onScrollSections[sectionSelector] = {
            callback: callback,
            isOverSection: null
        }
    }

}

export default FixedElement;