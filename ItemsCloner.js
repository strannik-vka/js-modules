class ItemsCloner {

    constructor({ itemsSelector, itemSelector, removeBtnSelector, addBtnSelector }) {
        this.itemsSelector = itemsSelector;
        this.itemSelector = itemSelector;
        this.removeBtnSelector = removeBtnSelector;
        this.addBtnSelector = addBtnSelector;
        this.itemOuterHTML = $(itemSelector)[0].outerHTML;
        this.itemsHTML = $(itemsSelector).html();

        $(document)
            .on('cloner.reset', this.itemsSelector, this.reset)
            .on('click', this.addBtnSelector, this.addItem)
            .on('click', this.removeBtnSelector, this.removeItem);
    }

    reset = () => {
        $(this.itemsSelector).html(this.itemsHTML);
    }

    addItem = () => {
        $(this.itemsSelector).append($(this.itemOuterHTML).hide());
        $(this.itemsSelector + ' ' + this.itemSelector + ':eq(-1)').slideDown('fast');
    }

    removeItem = (e) => {
        if (confirm('Подтверждаете удаление?')) {
            $(e.currentTarget).parents(this.itemSelector).slideUp('fast', function () {
                $(this).remove();
            });
        }
    }

}

export default ItemsCloner;