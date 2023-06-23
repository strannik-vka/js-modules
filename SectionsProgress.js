class SectionsProgress {

    /**
        * @typedef {object} options
        * @property {string} sectionsSelector - Селектор секций
        * @property {string} lineSelector - Селектор полоски
        * @property {string} dotsSelector - Селектор точек
        * @property {"vertical" | "horizontal"} orientation - Ориентация полоски
        * @param {options} options - {@link options} object
    */
    constructor(options) {
        this.options = options;

        if (!this.options.orientation) {
            this.options.orientation = 'vertical';
        }

        this.lineParent = $(this.options.lineSelector).parent();
        this.sectionsCount = $(this.options.sectionsSelector).length;

        this.events();
        this.sectionsEach();
    }

    getSectionPercent(section) {
        let positionSectionTop = section.offset().top - $(window).scrollTop(),
            positionWindowBottom = $(window).height(),
            sectionHeight = parseFloat(section.css('height'));

        let deff = positionWindowBottom - positionSectionTop,
            percent = 100 / (sectionHeight / deff);

        if (percent > 100) {
            percent = 100;
        } else if (percent < 0) {
            percent = 0;
        }

        return percent;
    }

    getDotLine(sectionPercent, index) {
        let dotElemStart = $(this.options.dotsSelector + ':eq(' + index + ')'),
            dotElemEnd = $(this.options.dotsSelector + ':eq(' + (index + 1) + ')'),
            distance = 0;

        if (this.options.orientation == 'vertical') {
            distance = dotElemEnd.offset().top - dotElemStart.offset().top;

            if (index == 0) {
                let startDistance = dotElemStart.offset().top - this.lineParent.offset().top;

                if (startDistance) {
                    distance += startDistance;
                }
            }
        } else {
            distance = dotElemEnd.offset().left - dotElemStart.offset().left;

            if (index == 0) {
                let startDistance = dotElemStart.offset().left - this.lineParent.offset().left;

                if (startDistance) {
                    distance += startDistance;
                }
            }
        }

        return (distance / 100) * sectionPercent;
    }

    sectionsEach() {
        let lineAll = 0;

        if (this.options.orientation == 'vertical') {
            this.dotHeight = parseFloat($(this.options.dotsSelector + ':eq(-1)').css('height'));
            this.lineParentHeight = parseFloat(this.lineParent.css('height'));
        } else {
            this.dotWidth = parseFloat($(this.options.dotsSelector + ':eq(-1)').css('width'));
            this.lineParentWidth = parseFloat(this.lineParent.css('width'));
        }

        $(this.options.sectionsSelector).each((index, section) => {
            let sectionPercent = this.getSectionPercent($(section)),
                dotLine = this.getDotLine(sectionPercent, index);

            lineAll += dotLine;

            if (sectionPercent == 100) {
                $(this.options.dotsSelector + ':eq(' + (index + 1) + ')').addClass('active');

                this.activeIndex = index;
            } else {
                $(this.options.dotsSelector + ':eq(' + (index + 1) + ')').removeClass('active');
            }
        });

        if (this.activeIndex == this.sectionsCount - 1) {
            if (this.options.orientation == 'vertical') {
                let endDistance = (this.lineParent.offset().top + this.lineParentHeight) - ($(this.options.dotsSelector + ':eq(-1)').offset().top + this.dotHeight);

                if (endDistance) {
                    lineAll += endDistance + this.dotHeight;
                }
            } else {
                let endDistance = (this.lineParent.offset().left + this.lineParentWidth) - ($(this.options.dotsSelector + ':eq(-1)').offset().left + this.dotWidth);

                if (endDistance) {
                    lineAll += endDistance + this.dotWidth;
                }
            }
        }

        if (this.options.orientation == 'vertical') {
            $(this.options.lineSelector).css('height', lineAll + 'px');
        } else {
            $(this.options.lineSelector).css('width', lineAll + 'px');
        }
    }

    onScroll = () => {
        this.sectionsEach();
    }

    events() {
        document.addEventListener('scroll', this.onScroll, false)
    }

    destroy() {
        document.removeEventListener('scroll', this.onScroll)
    }

}

export default SectionsProgress;