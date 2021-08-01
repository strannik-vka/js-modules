class InputsNavigate {

    constructor() {
        $(document)
            .on('click', '[data-inputs-prev], [data-inputs-next]', (e) => {
                this.currentElems(e);
                this.buttonClick();
            })
            .on('input', '[data-inputs-navigate] [data-inputs-input]:eq(-1) input', (e) => {
                this.currentElems(e);
                this.changeEndInput(e);
            });
    }

    currentElems(e) {
        this.button = $(e.currentTarget);
        this.parent = this.button.parents('[data-inputs-navigate]');
        this.currentInput = this.parent.find('[data-inputs-input].active');
        this.isNext = this.button.attr('data-inputs-next') != undefined;
        this.prevInput = this.currentInput.prev('[data-inputs-input]');
        this.nextInput = this.currentInput.next('[data-inputs-input]');
        this.showInput = this.isNext ? this.nextInput : this.prevInput;
        this.showInputNext = this.isNext ?
            this.showInput.next('[data-inputs-input]') :
            this.showInput.prev('[data-inputs-input]');
    }

    isErrors() {
        return this.parent.find('[data-error-input]').length;
    }

    showErrorInput() {
        $('[data-inputs-input]').each((i, item) => {
            if ($(item).find('[data-error-input]').length) {
                this.parent = $(item).parents('[data-inputs-navigate]');
                this.currentInput = this.parent.find('[data-inputs-input].active');
                this.showInput = $(item);

                this.show();

                return false;
            }
        });

        $('[data-inputs-prev], [data-inputs-next]').removeClass('active').addClass('deactive');
    }

    changeEndInput(e) {
        var val = $.trim($(e.currentTarget).val());

        if (val && !this.isErrors()) {
            $('[data-inputs-end-show]').show();
        } else {
            $('[data-inputs-end-show]').hide();
        }
    }

    show() {
        if (this.showInput.length) {
            this.currentInput.hide().removeClass('active');
            this.showInput.addClass('active').show();

            this.parent.find('.deactive').removeClass('deactive');

            if (this.showInputNext.length == 0) {
                this.button.addClass('deactive');
            }
        }
    }

    buttonClick() {
        if (!this.button.hasClass('deactive')) {
            this.show();
        }
    }

}

export default new InputsNavigate();