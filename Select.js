class Select {
    constructor() {
        this.selector = {
            parent: '[data-select]',
            title: '[data-select-title]',
            options: '[data-select-options]',
            option: '[data-select-option]',
            type: '[data-select-type]',
            query: '[data-select-query]',
            count: '[data-select-count]'
        };

        this.ajaxTimer = false;

        this.events();
        this.each();
    }

    select(select) {
        var options = select.find(this.selector.options),
            title = select.find(this.selector.title);

        return {
            title: title,
            options: options,
            elem: select,
            type: options.attr('data-select-type'),
            selected: select.find('input:checked').length,
            query: select.find(this.selector.query).length
                ? $.trim(select.find(this.selector.query).val())
                : null,
            url: select.attr('data-select')
                ? select.attr('data-select')
                : null,
            name: options.attr('data-select-options')
                ? options.attr('data-select-options')
                : select.find('[name]:eq(-1)').attr('name'),
            placeholder: title.attr('data-select-title')
                ? title.attr('data-select-title')
                : $.trim(title.text())
        };
    }

    each() {
        $(this.selector.parent).each((i, item) => {
            var select = this.select($(item));

            select.title.attr('data-select-title', select.placeholder);

            if (select.selected) {
                $(item).trigger('change');
            }

            if (select.url) {
                this.ajax($(item));
            }

            if (select.type == 'checkbox') {
                select.elem.addClass('multiple');
            }
        });
    }

    ajax(select) {
        var select = this.select(select);

        $.get(select.url, {
            name: select.query
        }, (json) => {
            select.options.find(this.selector.option).each((i, item) => {
                if (!$(item).find('input').is(':checked')) {
                    $(item).remove();
                }
            });

            $.each(json.data, (i, item) => {
                select.options.append('\
                    <div class="__select__checkbox" data-select-option>\
                        <input name="'+ select.name + '" id="' + select.name + '_' + item.id + '" class="__select__input" type="' + select.type + '" value="' + item.id + '" />\
                        <label for="' + select.name + '_' + item.id + '" class="__select__label">' + item.name + '</label>\
                    </div>\
                ');
            });
        });
    }

    search(e) {
        var select = $(e.currentTarget).parents(this.selector.parent);

        if (this.ajaxTimer) clearTimeout(this.ajaxTimer);

        this.ajaxTimer = setTimeout(() => {
            this.ajax(select);
        }, 1000);
    }

    events() {
        $(document)
            .on('input', this.selector.query, (e) => {
                this.search(e);
            })
            .on('change', this.selector.parent + ' input', (e) => {
                this.change(e);
            })
            .on('click', this.selector.title + ', ' + this.selector.query, (e) => {
                this.toggleActive(e);
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

    toggleActive(e) {
        var parent = $(e.currentTarget).parents(this.selector.parent);

        if (parent.hasClass('active') && $(e.currentTarget)[0].tagName != 'INPUT') {
            parent.removeClass('active');
        } else {
            parent.addClass('active');
        }
    }

    change(e) {
        var select = this.select($(e.currentTarget).parents(this.selector.parent)),
            text_arr = [];

        select.options.find('input:checked').each((i, item) => {
            text_arr.push($.trim(select.elem.find('[for="' + $(item).attr('id') + '"]:eq(0)').text()));
        });

        if (select.type == 'radio') {
            select.title.text(select.selected ? text_arr.join(', ') : select.placeholder);
        }

        if (select.selected) {
            select.elem.addClass('selected');
        } else {
            select.elem.removeClass('selected');
        }

        select.elem.find(this.selector.count).html(text_arr.length);
    }
}

export default new Select();