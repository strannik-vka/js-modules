class InputsNavigate {

    constructor() {
        $(document)
            .on('click', '[data-inputs-prev], [data-inputs-next]', (e) => {
                let button = $(e.currentTarget);

                if (typeof this.onClick === 'function') {
                    let action = button.attr('data-inputs-next') != undefined ? 'next' : 'prev';

                    this.onClick(action, (resume) => {
                        if (resume) {
                            this.currentElems(button);
                            this.buttonClick();
                        }
                    });
                } else {
                    this.currentElems(button);
                    this.buttonClick();
                }
            })
            .on('input', '[data-inputs-navigate] [data-inputs-input]:eq(-1) input', (e) => {
                this.currentElems($(e.currentTarget));
                this.changeEndInput(e);
            });

        $('[data-inputs-navigate]').each((e, item) => {
            $(item).parents('form').on('ajax-response', (e) => {
                this.submit(e);
            });
        });
    }

    submit(e) {
        var form = $(e.currentTarget);

        if (form.find('[data-error-input]').length) {
            this.showErrorInput();
        }
    }

    currentElems(button) {
        this.button = button;
        this.parent = this.button.parents('[data-inputs-navigate]');
        this.currentInput = this.parent.find('[data-inputs-input].active');
        this.showInput = this.button.attr('data-inputs-next') != undefined ?
            this.currentInput.next('[data-inputs-input]') :
            this.currentInput.prev('[data-inputs-input]');
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
    }

    changeEndInput(e) {
        if (this.changeEndInputTimer) clearTimeout(this.changeEndInputTimer);
        this.changeEndInputTimer = setTimeout(() => {
            var val = $.trim($(e.currentTarget).val());

            if (val && !this.isErrors()) {
                $('[data-inputs-end-show]').show();
            } else {
                $('[data-inputs-end-show]').hide();
            }
        }, 400);
    }

    show() {
        if (this.showInput.length) {
            this.currentInput.hide().removeClass('active');
            this.showInput.addClass('active').show();

            this.parent.find('.deactive').removeClass('deactive');

            if (this.showInput.next('[data-inputs-input]').length == 0) {
                this.parent.find('[data-inputs-next]').addClass('deactive');
            }

            if (this.showInput.prev('[data-inputs-input]').length == 0) {
                this.parent.find('[data-inputs-prev]').addClass('deactive');
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