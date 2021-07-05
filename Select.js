class Select {
    constructor(selector) {
        this.selector = selector;

        this.events();
        this.each(selector);
    }

    each(selector) {
        $(this.selector.parent).each(function () {
            $(this).find(selector.title).attr('data-select-title', $(this).find(selector.title).text());

            if ($(this).find('input:checked').length) {
                $(this).trigger('change');
            }
        });
    }

    events() {
        $(document)
            .on('change', this.selector.parent + ' input', (e) => {
                this.change(e);
            })
            .on('click', this.selector.title, (e) => {
                this.titleClick(e);
            })
            .on('click', (e) => {
                this.closest(e);
            });
    }

    closest(e) {
        if (!$(e.target).closest(this.selector.parent).length) {
            $(this.selector.parent).removeClass('active');
        }
    }

    titleClick(e) {
        var parent = $(e.currentTarget).parents(this.selector.parent);

        if (parent.hasClass('active')) {
            parent.removeClass('active');
        } else {
            parent.addClass('active');
        }
    }

    change(e) {
        var parent = $(e.currentTarget).parents(this.selector.parent),
            titleElem = parent.find(this.selector.title);

        var text_arr = [];
        parent.find('input:checked').each(function () {
            var text = $.trim(parent.find('[for="' + $(this).attr('id') + '"]:eq(0)').text());
            text_arr.push(text);
        });

        titleElem.text(text_arr.length ? text_arr.join(', ') : titleElem.attr('data-select-title'));

        if (text_arr.length) {
            parent.addClass('selected');
        } else {
            parent.removeClass('selected');
        }
    }
}

export default new Select({
    parent: '[data-select]',
    title: '[data-select-title]'
});