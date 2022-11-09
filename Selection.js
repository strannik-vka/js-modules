/*
    Атрибуты:
    data-selection | родитель, элемент select
*/

class Selection {

    constructor(options) {
        options = typeof options === 'object' && options != null ? options : {};

        this.selector = options.selector ? options.selector : '[data-selection]';
        this.placeholder = options.placeholder ? options.placeholder : '';

        this.init();
        this.events();
    }

    init() {
        $(this.selector).each((i, select) => {
            $(select)
                .hide()
                .after(this.getTemplate($(select)));

            let selection = $(select).next();

            $(select).find('[selected]').each((index, option) => {
                this.optionOnClick(selection.find('[data-value="' + $(option).val() + '"]'));
            });
        });
    }

    events() {
        $(document)
            .on('click', '.selection__select', (e) => {
                this.selectOnClick($(e.currentTarget));
            })
            .on('click', '.selection__option', (e) => {
                this.optionOnClick($(e.currentTarget));
            })
            .on('mouseup', (e) => {
                if ($('.selection').has(e.target).length === 0) {
                    this.hideAll();
                }
            });
    }

    selectOnClick(selection_select) {
        let selection = selection_select.parents('.selection'),
            isShow = selection.hasClass('active');

        this.hideAll();

        if (isShow) {
            this.hide(selection);
        } else {
            this.show(selection);
        }
    }

    optionOnClick(selection_option) {
        let selection = selection_option.parents('.selection'),
            isActive = selection_option.hasClass('active'),
            value = selection_option.attr('data-value'),
            isMultiple = selection.hasClass('multiple'),
            select = selection.prev();

        if (isActive) {
            selection_option.removeClass('active');
            select.find('[value="' + value + '"]').prop('selected', false);
        } else {
            selection_option.addClass('active');
            select.find('[value="' + value + '"]').prop('selected', true);
        }

        let count = selection.find('.active').length;

        selection.find('.selection__count').html(count);

        if (count) {
            selection.addClass('selected');
        } else {
            selection.removeClass('selected');
        }

        let values = [];

        selection.find('.active').each((i, option) => {
            values.push($(option).text());
        });

        if (values.length == 0) {
            values.push(select.attr('placeholder') ? select.attr('placeholder') : this.placeholder);
        }

        selection.find('.selection__placeholder').html(values.join(', '));

        if (!isMultiple) {
            this.hide(selection);
        }

        select.trigger('change');
    }

    show(selection) {
        selection.addClass('active');
    }

    hide(selection) {
        selection.removeClass('active');
    }

    hideAll() {
        $('.selection.active').removeClass('active');
    }

    getTemplate(select) {
        let selection = '', selection_select = '', selection_options = '',
            placeholder = this.placeholder,
            isMultiple = select.attr('multiple');

        if (select.attr('placeholder')) {
            placeholder = select.attr('placeholder');
        }

        if (placeholder) {
            selection_select += '<div class="selection__placeholder">' + placeholder + '</div>';
        }

        if (isMultiple) {
            selection_select += '<div class="selection__count"></div>';
        }

        selection_select += '<div class="selection__toggle"></div>';

        selection += '<div class="selection__select">' + selection_select + '</div>';

        select.find('option').each((i, item) => {
            let label = $(item).html();

            if ($(item).attr('data-html')) {
                label = $(item).attr('data-html');
            }

            selection_options += '<div data-value="' + $(item).val() + '" class="selection__option">' + label + '</div>';
        });

        selection += '<div class="selection__options">' + selection_options + '</div>';

        return '<div class="selection ' + (isMultiple ? 'multiple' : '') + '">' + selection + '</div>';
    }

}

$(() => {
    new Selection();
})

export default Selection;