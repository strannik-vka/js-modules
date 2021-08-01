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
            });
    }

    currentElems(e) {
        this.button = $(e.currentTarget);
        this.parent = $(e.currentTarget).parents('[data-inputs-navigate]');
        this.currentInput = this.parent.find('input.active');
    }

    prev() {
        if (this.currentInput.prev('input').length) {
            this.currentInput.fadeOut(400, () => {
                this.currentInput.removeClass('active');
                this.currentInput.prev().addClass('active').fadeIn(500);

                this.parent.find('.deactive').removeClass('deactive');

                if (this.currentInput.prev().prev('input').length == 0) {
                    this.button.addClass('deactive');
                }
            });
        }
    }

    next() {
        if (this.currentInput.next('input').length) {
            this.currentInput.fadeOut(400, () => {
                this.currentInput.removeClass('active');
                this.currentInput.next().addClass('active').fadeIn(500);

                this.parent.find('.deactive').removeClass('deactive');

                if (this.currentInput.next().next('input').length == 0) {
                    this.button.addClass('deactive');
                }
            });
        }
    }

}

new InputsNavigate();