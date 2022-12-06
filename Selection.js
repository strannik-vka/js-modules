/*
    Атрибуты:
    data-selection | родитель, элемент select
    options: {
        selector: '[name="id_isp"]', - селектор элемента
        search: true, - поиск по списку
        create: true, - добавить напечатанное в список
    }
*/

class Selection {

    constructor(options) {
        this.options = typeof options === 'object' && options != null ? options : {};

        this.options.selector = this.options.selector ? this.options.selector : '[data-selection]';
        this.options.placeholder = this.options.placeholder ? this.options.placeholder : (
            $(this.options.selector).attr('placeholder') ? $(this.options.selector).attr('placeholder') : ''
        );

        if (this.isOption('search')) {
            $(this.options.selector).attr('data-search', 'true');
        }

        if (this.isOption('create')) {
            $(this.options.selector).attr('data-create', 'true');
        }

        this.isNewOptionSelected = false;

        this.init();
        this.events();
    }

    isOption(key, elem) {
        let result = false;

        if (typeof elem === 'object') {
            if (elem.length) {
                console.log(typeof elem.attr('data-' + key));
                if (typeof elem.attr('data-' + key) !== 'undefined') {
                    result = elem.attr('data-' + key) != 'false';
                }
            }
        } else {
            if (typeof this.options[key] !== 'undefined') {
                result = this.options[key];
            } else {
                if (typeof $(this.options.selector).attr('data-' + key) !== 'undefined') {
                    result = $(this.options.selector).attr('data-' + key) != 'false';
                }
            }
        }

        return result;
    }

    init() {
        $(this.options.selector).each((i, select) => {
            $(select)
                .hide()
                .after(this.getTemplate($(select)));

            let selection = $(select).next();

            $(select).find('[selected]').each((i, option) => {
                this.optionOnClick(selection.find('[data-value="' + $(option).val() + '"]'));
            });
        });
    }

    events() {
        if (!window.selectionEvents) {
            window.selectionEvents = true;

            $(document)
                .on('click', '.selection__select', (e) => {
                    this.selectOnClick($(e.currentTarget));
                })
                .on('click', '.selection__option', (e) => {
                    this.optionOnClick($(e.currentTarget));
                })
                .on('input', '.selection__placeholder__input', (e) => {
                    this.onInput($(e.currentTarget));
                })
                .on('blur', '.selection__placeholder__input', (e) => {
                    this.onBlur($(e.currentTarget));
                })
                .on('mouseup', (e) => {
                    if ($('.selection').has(e.target).length === 0) {
                        this.hideAll();
                    }
                });
        }
    }

    onInput(input) {
        let query = $.trim(input.val()),
            selection = input.parents('.selection'),
            select = selection.prev();

        this.show(selection);

        if (!query) {
            this.removeSelected(selection);
        }

        if (this.isOption('create', select)) {
            this.newOptionRemove(selection);

            if (query) {
                select.prepend('<option data-new-option value="' + query + '">' + query + '</option>');
                selection.find('.selection__options').prepend('<div data-new-value="' + query + '" class="selection__option">' + query + '</div>');
            }
        }

        this.search(input);
    }

    search(input) {
        let query = $.trim(input.val()),
            selection = input.parents('.selection');

        if (query) {
            selection.find('[data-value]').each((i, option) => {
                if ($(option).text().indexOf(query) > -1) {
                    $(option).show();
                } else {
                    $(option).hide();
                }
            });
        } else {
            selection.find('[data-value]').show();
        }
    }

    newOptionRemove(selection) {
        selection.prev().find('[data-new-option]').remove();
        selection.find('[data-new-value]').remove();
    }

    onBlur(input) {
        setTimeout(() => {
            let selection = input.parents('.selection');

            if (!this.isNewOptionSelected) {
                this.newOptionRemove(selection);
            }

            input.val(this.getActiveValues(input));
            selection.find('.selection__option').show();
        }, 400);
    }

    getActiveValues(elem) {
        let selection = elem.closest('.selection'),
            values = [];

        selection.prev().find('[selected]').each((i, option) => {
            values.push($(option).html());
        });

        return values.join(', ');
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

    removeSelected(selection) {
        selection.find('.active').removeClass('active');
        selection.prev().find('[selected]').prop('selected', false).removeAttr('selected');
    }

    optionOnClick(selection_option) {
        let selection = selection_option.parents('.selection'),
            isActive = selection_option.hasClass('active'),
            isMultiple = selection.hasClass('multiple'),
            select = selection.prev(),
            isNewOption = selection_option.attr('data-new-value'),
            value = selection_option.attr('data-value')
                ? selection_option.attr('data-value')
                : selection_option.attr('data-new-value');

        if (isNewOption) {
            this.isNewOptionSelected = !isActive;
        } else {
            this.isNewOptionSelected = false;
            this.newOptionRemove(selection);
        }

        if (isActive) {
            selection_option.removeClass('active');
            select.find('[value="' + value + '"]').prop('selected', false).removeAttr('selected');
        } else {
            if (!isMultiple) {
                this.removeSelected(selection);
            }

            selection_option.addClass('active');
            select.find('[value="' + value + '"]').prop('selected', true).attr('selected', 'selected');
        }

        let count = selection.find('.active').length;

        selection.find('.selection__count').html('(' + count + ')');

        if (count) {
            selection.addClass('selected');
        } else {
            selection.removeClass('selected');
        }

        let values = this.getActiveValues(selection);

        if (this.isOption('search', select)) {
            selection.find('[data-placeholder]').val(values ? values : '');
        } else {
            selection.find('[data-placeholder]').html(values ? values : this.options.placeholder);
        }

        if (!isMultiple) {
            this.hide(selection);
        }

        select.trigger('change');
    }

    show(selection) {
        selection.addClass('active');

        if (this.isOption('search', selection.prev())) {
            selection.find('.selection__placeholder__input').focus();
        }
    }

    hide(selection) {
        selection.removeClass('active');
    }

    hideAll() {
        $('.selection.active').removeClass('active');
    }

    getTemplate(select) {
        let selection = '', selection_select = '', selection_options = '',
            isMultiple = select.attr('multiple');

        if (this.options.placeholder) {
            if (this.isOption('search', select)) {
                selection_select += '<input data-placeholder type="text" class="selection__placeholder__input" placeholder="' + this.options.placeholder + '" />';
            } else {
                selection_select += '<div data-placeholder class="selection__placeholder">' + this.options.placeholder + '</div>';
            }
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
    if ($('[data-selection]').length) {
        $('[data-selection]').each(index => {
            new Selection({
                selector: '[data-selection]:eq(' + index + ')'
            });
        });

    }
})

export default Selection;