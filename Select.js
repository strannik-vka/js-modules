class Select {
    constructor() {
        this.selector = {
            parent: '[data-select]',
            title: '[data-select-title]',
            options: '[data-select-options]',
            option: '[data-select-option]',
            type: '[data-select-type]',
            query: '[data-select-query]'
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
                        <input name="'+ select.name + '" id="' + select.name + '_' + i + '" class="__select__input" type="' + select.type + '" value="' + item.id + '" />\
                        <label for="' + select.name + '_' + i + '" class="__select__label">' + item.name + '</label>\
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

export default new Select();