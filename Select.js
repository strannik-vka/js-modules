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
    }

    select(select) {
        var options = select.find(this.selector.options),
            title = select.find(this.selector.title);

        return {
            title: title,
            options: options,
            elem: select,
            type: options.attr('data-select-type') ? options.attr('data-select-type') : options.find('input').attr('type'),
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
                this.ajax($(item), i);
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
            this.addOptions(select.elem, json.data);
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
            .on('click', this.selector.parent + ' label', (e) => {
                $(e.currentTarget).parent().find('input').trigger('change');
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

        document.addEventListener('DOMContentLoaded', () => {
            this.each();
        }, false);
    }

    closest(e) {
        if (!$(e.target).closest(this.selector.parent).length) {
            $(this.selector.parent).removeClass('active');
            $(this.selector.query).val('').removeAttr('placeholder');
        }
    }

    toggleActive(e) {
        var select = this.select($(e.currentTarget).parents(this.selector.parent));

        if (select.elem.hasClass('active') && $(e.currentTarget)[0].tagName != 'INPUT') {
            select.elem.removeClass('active');
        } else {
            select.elem.addClass('active');

            if (select.type == 'checkbox') {
                setTimeout(() => {
                    select.elem.find(this.selector.query).attr('placeholder', select.elem.find(this.selector.query).attr('data-placeholder'));
                }, 200);
            }
        }
    }

    getTextLabel(input) {
        var parent = input.parent();

        if (parent[0].tagName == 'LABEL') {
            return $.trim(parent.text());
        }

        if (parent.find('label').length) {
            return $.trim(parent.find('label').text());
        }

        return $.trim($('[for="' + input.attr('id') + '"]:eq(0)').text());
    }

    change(e) {
        var select = this.select($(e.currentTarget).parents(this.selector.parent)),
            text_arr = [];

        select.options.find('input:checked').each((i, item) => {
            text_arr.push(this.getTextLabel($(item)));
        });

        if (select.selected) {
            select.elem.addClass('selected');
        } else {
            select.elem.removeClass('selected');
        }

        select.elem.find(this.selector.count).html(text_arr.length);

        if (select.type == 'radio') {
            select.title.text(select.selected ? text_arr.join(', ') : select.placeholder);
            select.elem.removeClass('active');
        }
    }

    addOptions(select, options, obj) {
        var select = this.select(select),
            obj = obj ? obj : {
                remove: true,
                checked: false
            }

        if (obj.remove) {
            select.options.find(this.selector.option).each((i, item) => {
                if (!$(item).find('input').is(':checked')) {
                    $(item).remove();
                }
            });
        }

        $.each(options, (i, item) => {
            if (select.options.find('[value="' + item.id + '"]').length == 0) {
                select.options.append('\
                    <div class="__select__checkbox" data-select-option>\
                        <label class="__select__label">\
                            ' + item.name + '\
                            <input class="__select__input" '+ (obj.checked ? 'checked' : '') + ' name="' + select.name + '" type="' + select.type + '" value="' + item.id + '" />\
                        </label>\
                    </div>\
                ');
            } else {
                $('[value="' + item.id + '"]').prop('checked', true);
            }
        });

        if (obj.checked) {
            select.options.find('input').trigger('change');
        }
    }
}

export default new Select();