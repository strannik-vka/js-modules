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
        this.bodyWidth2 = $(this.wrapSelector).width() / 2;
        this.cursorWidth2 = this.cursor.width() / 2;
        this.cursorHeight2 = this.cursor.height() / 2;
        this.WrapOffsetLeft = $(this.wrapSelector).offset().left;
        this.WrapCenter = this.WrapOffsetLeft + this.bodyWidth2;
    }

    wrapDefaultCursorOff() {
        if ($('#wrapDefaultCursorOff_' + this.id).length == 0) {
            $('body').append('<style id="wrapDefaultCursorOff_' + this.id + '">' + this.wrapSelector + ', ' + this.wrapSelector + ' * {cursor: none} ' + this.wrapSelector + ' a, ' + this.wrapSelector + ' a * {cursor: pointer}</style>');
        }
    }

    destroy() {
        this.cursor.css('display', 'none');

        $('body').off('mousemove', this.mousemoveEvent);

        this.cursor.off('click', this.cursorClickEvent);

        $(window).off('resize', this.setParams);

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

    getParams(event) {
        this.hoverElem = $(document.elementFromPoint(event.clientX, event.clientY));

        this.cursorHeight2 = this.cursor.height() / 2;
        this.cursorTop = this.cursor.offset().top + this.cursorHeight2;
        this.wrapTop = $(this.wrapSelector).offset().top;
        this.wrapBottom = this.wrapTop + $(this.wrapSelector).height();

        if ((this.cursorTop >= this.wrapTop && this.cursorTop <= this.wrapBottom) && this.inWrap) {
            this.inWrap = true;
        } else if (this.hoverElem.closest(this.wrapSelector).length) {
            this.inWrap = true;
        } else {
            this.inWrap = false;
        }

        this.top = event.clientY - this.cursorHeight2;
        this.left = event.clientX - this.cursorWidth2;

        this.isLeft = this.left < this.WrapCenter;
    }

    mousemoveEvent = (event) => {
        this.getParams(event);
        this.setCursorPosition();

        if (this.onMousemove) {
            this.onMousemove({
                inWrap: this.inWrap,
                isLeft: this.isLeft,
                hoverElem: this.hoverElem
            });
        }
    }

    cursorClickEvent = () => {
        if (this.onClick) {
            this.onClick({
                isLeft: this.isLeft,
                hoverElem: this.hoverElem
            });
        }
    }

    events() {
        document.addEventListener('mousemove', this.mousemoveEvent);

        this.cursor.on('click', this.cursorClickEvent);

        $(window).on('resize', this.setParams);
    }

    triggerMousemove() {
        var event = $.Event('mousemove');
        event.clientX = this.left + this.cursorWidth2;
        event.clientY = this.top + this.cursorHeight2;
        $('body').trigger(event);
    }

}

export default MyCursor;