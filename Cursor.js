class Cursor {

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
        this.cursorWidth = this.cursor.width() / 2;
        this.cursorHeight = this.cursor.height() / 2;
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
            this.cursor.css({
                top: this.top,
                left: this.left,
                display: 'block'
            });
        }
    }

    getParams(event) {
        this.hoverElem = $(document.elementFromPoint(event.clientX, event.clientY));

        this.inWrap = this.hoverElem.closest(this.wrapSelector).length && this.hoverElem.closest('a').length == 0;

        this.top = event.clientY - this.cursorHeight;
        this.left = event.clientX - this.cursorWidth;

        this.isLeft = this.left < this.WrapCenter;
    }

    mousemoveEvent = (event) => {
        this.cursor.hide();

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
        $('body').on('mousemove', this.mousemoveEvent);

        this.cursor.on('click', this.cursorClickEvent);

        $(window).on('resize', this.setParams);
    }

    triggerMousemove() {
        var event = $.Event('mousemove');
        event.clientX = this.left + this.cursorWidth;
        event.clientY = this.top + this.cursorHeight;
        $('body').trigger(event);
    }

}

export default Cursor;