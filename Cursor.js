class Cursor {

    constructor(obj) {
        this.cursor = $(obj.cursor);

        this.wrapSelector = obj.wrap ? obj.wrap : 'body';
        this.bodyWidth2 = $('body').width() / 2;

        this.onMousemove = obj.onMousemove;
        this.onClick = obj.onClick;

        this.cursorWidth = this.cursor.width() / 2;
        this.cursorHeight = this.cursor.height() / 2;

        this.wrapDefaultCursorOff();
        this.mousemove();
    }

    wrapDefaultCursorOff() {
        $('body').append('<style>' + this.wrapSelector + ', ' + this.wrapSelector + ' * {cursor: none}</style>');
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

        this.isLeft = this.left < this.bodyWidth2;
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

}

export default Cursor;