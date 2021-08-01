class InputsNavigate {

    constructor() {
        $(document)
            .on('click', '[data-inputs-prev]', (e) => {
                this.currentElems(e);
                this.prev();
            })
            .on('click', '[data-inputs-next]', (e) => {
                this.currentElems(e);
                this.next();
            })
            .on('input', '[data-inputs-navigate] [data-inputs-input]:eq(-1) input', (e) => {
                this.currentElems(e);
                this.changeEndInput(e);
            });
    }

    changeEndInput(e) {
        var val = $.trim($(e.currentTarget).val());

        if (val) {
            $('[data-inputs-end-show]').show();
        } else {
            $('[data-inputs-end-show]').hide();
        }
    }

    currentElems(e) {
        this.button = $(e.currentTarget);
        this.parent = $(e.currentTarget).parents('[data-inputs-navigate]');
        this.currentInput = this.parent.find('[data-inputs-input].active');
    }

    prev() {
        if (!this.currentInput.hasClass('deactive')) {
            if (this.currentInput.prev('[data-inputs-input]').length) {
                this.currentInput.fadeOut(400, () => {
                    this.currentInput.removeClass('active');
                    this.currentInput.prev().addClass('active').fadeIn(500);

                    this.parent.find('.deactive').removeClass('deactive');

                    if (this.currentInput.prev().prev('[data-inputs-input]').length == 0) {
                        this.button.addClass('deactive');
                    }
                });
            }
        }
    }

    next() {
        if (!this.currentInput.hasClass('deactive')) {
            if (this.currentInput.next('[data-inputs-input]').length) {
                this.currentInput.fadeOut(400, () => {
                    this.currentInput.removeClass('active');
                    this.currentInput.next().addClass('active').fadeIn(500);

                    this.parent.find('.deactive').removeClass('deactive');

                    if (this.currentInput.next().next('[data-inputs-input]').length == 0) {
                        this.button.addClass('deactive');
                    }
                });
            }
        }
    }

}

new InputsNavigate();