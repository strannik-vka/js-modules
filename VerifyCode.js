class VerifyCode {

    constructor(selector) {
        this.selector = selector;

        this.events();
    }

    focus() {
        $(this.selector + ' input:eq(0)').trigger('focus');
    }

    clear() {
        $(this.selector + ' input').val('');
    }

    inputChange = (e) => {
        let input = $(e.currentTarget),
            inputVal = $.trim(input.val()),
            nextInput = this.getNextInput(),
            code = this.getCode();

        if (typeof this.onChange === 'function') {
            this.onChange(code);
        }

        if (inputVal) {
            if (nextInput.length) {
                nextInput.trigger('focus');
            } else {
                if (code.length == this.inputsCount()) {
                    if (typeof this.onFill === 'function') {
                        this.onFill(code);
                    }
                }
            }
        } else {
            input.val('');
        }
    }

    inputKeyDown = (e) => {
        let key = e.keyCode || e.charCode,
            input = $(e.currentTarget),
            inputVal = $.trim(input.val());

        if ([8, 46].indexOf(key) > -1) {
            if (!inputVal) {
                let prevInput = this.getPrevInput();

                prevInput.trigger('focus');
            }
        }
    }

    events() {
        $(this.selector + ' input')
            .on('paste', this.inputPaste)
            .on('input', this.inputChange)
            .on('keydown', this.inputKeyDown)
    }

    destroy() {
        $(this.selector + ' input')
            .off('paste', this.inputPaste)
            .off('input', this.inputChange)
            .off('keydown', this.inputKeyDown)
    }

    inputPaste = (e) => {
        e.preventDefault();

        let code = new String(e.originalEvent.clipboardData.getData('text'));

        if (code.length == 4) {
            $(this.selector + ' input').each((i, item) => {
                $(item).val(code[i]);
            });

            $(this.selector + ' input:eq(-1)').trigger('focus').trigger('input');
        }
    }

    inputsCount() {
        return $(this.selector + ' input').length;
    }

    getPrevInput() {
        let input = $();

        $(this.selector + ' input').each((i, item) => {
            if ($(item).is(":focus")) {
                return false;
            }

            input = $(item);
        })

        return input;
    }

    getNextInput() {
        let input = $(),
            next = false;

        $(this.selector + ' input').each((i, item) => {
            if ($(item).is(":focus")) {
                next = true;
            } else if (next) {
                input = $(item);
                return false;
            }
        })

        return input;
    }

    getCode() {
        let code = [];

        $(this.selector + ' input').each((i, item) => {
            let val = $.trim($(item).val());

            if (val) {
                code.push(val);
            }
        })

        return code.join('');
    }

}

export default VerifyCode;