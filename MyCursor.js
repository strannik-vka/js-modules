class MyCursor {

    constructor(obj) {
        this.id = +new Date();
        this.cursor = $(obj.cursor);
        this.wrapSelector = obj.wrap ? obj.wrap : 'body';
        this.onMousemove = obj.onMousemove;
        this.onClick = obj.onClick;
        this.setParams();
        this.wrapDefaultCursorOff();
        this.events();
    }

    setParams = () => {
        this.bodyWidth2 = parseFloat($(this.wrapSelector).css('width')) / 2;
        this.cursorWidth2 = parseFloat(this.cursor.css('width')) / 2;
        this.cursorHeight2 = parseFloat(this.cursor.css('height')) / 2;
        this.WrapOffsetLeft = $(this.wrapSelector).offset().left;
        this.WrapCenter = this.WrapOffsetLeft + this.bodyWidth2;
    }

    wrapDefaultCursorOff() {
        if ($('#wrapDefaultCursorOff_' + this.id).length == 0) {
            $('body').append('<style id="wrapDefaultCursorOff_' + this.id + '">' + this.wrapSelector + ', ' + this.wrapSelector + ' * {cursor: none} ' + this.wrapSelector + ' a, ' + this.wrapSelector + ' a * {cursor: pointer}</style>');
        }
    }

    destroy() {
        this.cursor.removeClass('cursor-in-wrap');

        $('body').off('mousemove', this.mousemoveEvent);

        this.cursor.off('click', this.cursorClickEvent).removeAttr('style');

        $(window).off('resize', this.setParams);
        $(window).off('scroll', this.scrollEvent);

        $('#wrapDefaultCursorOff_' + this.id).remove();
    }

    setCursorPosition() {
        if (this.inWrap) {
            this.cursor.addClass('cursor-in-wrap');
            this.cursor.css({
                left: this.left + 'px',
                top: this.top + 'px'
            });
        } else {
            this.cursor.removeClass('cursor-in-wrap');
        }
    }

    getParams() {
        this.hoverElem = $(document.elementFromPoint(this.moveEvent.clientX, this.moveEvent.clientY));

        this.wrapTop = $(this.wrapSelector)[0].getBoundingClientRect().top;
        this.wrapBottom = this.wrapTop + parseFloat($(this.wrapSelector).css('height'));
        this.wrapLeft = $(this.wrapSelector).offset().left;
        this.wrapRight = this.wrapLeft + parseFloat($(this.wrapSelector).css('width'));

        if (
            (this.moveEvent.clientY >= this.wrapTop && this.moveEvent.clientY <= this.wrapBottom) &&
            (this.moveEvent.clientX >= this.wrapLeft && this.moveEvent.clientX <= this.wrapRight)
        ) {
            this.inWrap = true;
        } else if (this.hoverElem.closest(this.wrapSelector).length) {
            this.inWrap = true;
        } else {
            this.inWrap = false;
        }

        this.cursorHeight2 = parseFloat(this.cursor.css('height')) / 2;

        this.top = this.moveEvent.clientY - this.cursorHeight2;
        this.left = this.moveEvent.clientX - this.cursorWidth2;

        this.isLeft = this.left < this.WrapCenter;
    }

    mousemoveEvent = (event) => {
        this.moveEvent = event;

        if ($(this.wrapSelector).length) {
            this.getParams();
            this.setCursorPosition();

            if (this.onMousemove) {
                this.onMousemove({
                    inWrap: this.inWrap,
                    isLeft: this.isLeft,
                    hoverElem: this.hoverElem,
                    moveEvent: this.moveEvent
                });
            }
        }
    }

    cursorClickEvent = () => {
        if (this.onClick) {
            this.onClick({
                isLeft: this.isLeft,
                hoverElem: this.hoverElem,
                moveEvent: this.moveEvent
            });
        }
    }

    scrollEvent = () => {
        if (typeof window.currentMousemove !== 'undefined') {
            this.mousemoveEvent(window.currentMousemove);
        }
    }

    events() {
        $('body').on('mousemove', this.mousemoveEvent);

        this.cursor.on('click', this.cursorClickEvent);

        $(window).on('resize', this.setParams);
        $(window).on('scroll', this.scrollEvent);
    }

    triggerMousemove() {
        var event = $.Event('mousemove');
        event.clientX = this.left + this.cursorWidth2;
        event.clientY = this.top + this.cursorHeight2;
        $('body').trigger(event);
    }

}

export default MyCursor;