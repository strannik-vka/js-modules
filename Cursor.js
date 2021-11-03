class Cursor {

    constructor(obj) {
        this.cursor = $(obj.cursor);
        this.wrapSelector = obj.wrap ? obj.wrap : 'body';
        this.onMousemove = obj.onMousemove;
        this.onClick = obj.onClick;
        this.setParams();
        this.wrapDefaultCursorOff();
        this.mousemove();
        this.click();
        this.resize();
    }

    resize() {
        $(window).on('resize', () => {
            this.setParams();
        });
    }

    setParams() {
        this.bodyWidth2 = $(this.wrapSelector).width() / 2;
        this.cursorWidth = this.cursor.width() / 2;
        this.cursorHeight = this.cursor.height() / 2;
        this.WrapOffsetLeft = $(this.wrapSelector).offset().left;
        this.WrapCenter = this.WrapOffsetLeft + this.bodyWidth2;
    }

    wrapDefaultCursorOff() {
        $('body').append('<style>' + this.wrapSelector + ', ' + this.wrapSelector + ' * {cursor: none} ' + this.wrapSelector + ' a, ' + this.wrapSelector + ' a * {cursor: pointer}</style>');
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

    mousemove() {
        $('body').on('mousemove', (event) => {
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
        });
    }

    click() {
        this.cursor.on('click', () => {
            if (this.onClick) {
                this.onClick({
                    isLeft: this.isLeft,
                    hoverElem: this.hoverElem
                });
            }
        });
    }

    triggerMousemove() {
        var event = $.Event('mousemove');
        event.clientX = this.left + this.cursorWidth;
        event.clientY = this.top + this.cursorHeight;
        $('body').trigger(event);
    }

}

export default Cursor;