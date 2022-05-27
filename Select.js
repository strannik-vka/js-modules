class Select {
    constructor() {
        this.selector = {
            parent: '[data-select]',
            title: '[data-select-title]',
            options: '[data-select-options]',
            option: '[data-select-option]',
            type: '[data-select-type]',
            query: '[data-select-query]',
            count: '[data-select-count]',
            sync: 'data-select-options-sync'
        };

        this.ajaxTimer = false;

        $(document)
            .on('input', this.selector.query, this.search)
            .on('click', this.selector.parent + ' label', this.onClickLabel)
            .on('change', this.selector.parent + ' input', this.change)
            .on('change.select', this.selector.parent + ' input', this.change)
            .on('click', this.selector.title + ', ' + this.selector.query, this.toggleActive)
            .on('click', '[' + this.selector.sync + '] [data-val]', this.sync)
            .on('click', this.closest)
            .on('reset', 'form', this.reset);

        document.addEventListener('DOMContentLoaded', () => {
            this.each();
        }, false);
    }

    reset = (e) => {
        let form = $(e.currentTarget);

        form.find(this.selector.options + ' :checked').each((i, option) => {
            $(option).removeAttr('checked').prop('checked', false).trigger('change');
        });

        form.find(this.selector.options + ' [checked]').each((i, option) => {
            $(option).removeAttr('checked').prop('checked', false).trigger('change');
        });
    }

    select(select) {
        var options = select.find(this.selector.options),
            title = select.find(this.selector.title);

        let selected = select.find('input:checked').length;

        if (selected == 0 && select.find('[checked]').length) {
            selected = select.find('[checked]').length;
        }

        return {
            title: title,
            options: options,
            elem: select,
            type: options.attr('data-select-type') && options.attr('data-select-type') != 'true' ? options.attr('data-select-type') : options.find('input').attr('type'),
            selected: selected,
            query: select.find(this.selector.query).length
                ? $.trim(select.find(this.selector.query).val())
                : null,
            url: select.attr('data-select') && select.attr('data-select') != 'true'
                ? select.attr('data-select')
                : null,
            name: options.attr('data-select-options') && options.attr('data-select-options') != 'true'
                ? options.attr('data-select-options')
                : select.find('[name]:eq(-1)').attr('name'),
            placeholder: title.attr('data-select-title') && title.attr('data-select-title') != 'true'
                ? title.attr('data-select-title')
                : $.trim(title.text())
        };
    }

    each() {
        $(this.selector.parent).each((i, item) => {
            var select = this.select($(item));

            select.title.attr('data-select-title', select.placeholder);

            if (select.selected) {
                if ($(item).find('input:checked').length) {
                    $(item).find('input:checked').trigger('change');
                } else if ($(item).find('[checked]').length) {
                    $(item).find('[checked]').trigger('change');
                }
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
            this.addOptions(select.elem, json.data);
        });
    }

    search = (e) => {
        var select = $(e.currentTarget).parents(this.selector.parent);

        if (this.ajaxTimer) clearTimeout(this.ajaxTimer);

        this.ajaxTimer = setTimeout(() => {
            this.ajax(select);
        }, 1000);
    }

    onClickLabel = (e) => {
        if ($(e.currentTarget).find('input').length == 0) {
            $(e.currentTarget).parent().find('input').trigger('change');
        }
    }

    sync = (e) => {
        var option = $(e.target),
            val = option.attr('data-val'),
            parent_sync = option.closest('[' + this.selector.sync + ']'),
            name = parent_sync.attr(this.selector.sync),
            select_name = parent_sync.attr('data-select-name');

        $('[data-select-name="' + select_name + '"] [name="' + name + '"][value="' + val + '"]')
            .prop('checked', true)
            .trigger('change');
    }

    closest = (e) => {
        if (!$(e.target).closest(this.selector.parent).length) {
            $(this.selector.parent).removeClass('active');
            $(this.selector.query).val('').removeAttr('placeholder');
        }
    }

    closeAll(select) {
        select.elem.attr('data-active', true);

        $(this.selector.parent + ':not([data-active])').each((i, item) => {
            $(item).removeClass('active');
            $(item).find(this.selector.query).val('').removeAttr('placeholder');
        });

        select.elem.removeAttr('data-active');
    }

    toggleActive = (e) => {
        var select = this.select($(e.currentTarget).parents(this.selector.parent));

        if (select.elem.attr('disabled')) {
            return false;
        }

        this.closeAll(select);

        if (select.elem.hasClass('active') && $(e.currentTarget)[0].tagName != 'INPUT') {
            select.elem.removeClass('active');
        } else {
            select.elem.addClass('active');

            if (select.options.find('[name]').length == 0) {
                this.ajax(select.elem);
            }

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

        if ($('[for="' + input.attr('id') + '"]:eq(0)').length) {
            return $.trim($('[for="' + input.attr('id') + '"]:eq(0)').text());
        }

        if (parent.find('label').length && parent.attr('data-select-options') === undefined) {
            return $.trim(parent.find('label').text());
        }
    }

    change = (e) => {
        var select = this.select($(e.currentTarget).parents(this.selector.parent)),
            text_arr = [];

        if (select.selected) {
            if (select.options.find('input:checked').length) {
                select.options.find('input:checked').each((i, item) => {
                    text_arr.push(this.getTextLabel($(item)));
                });
            } else {
                select.options.find('[checked]').each((i, item) => {
                    text_arr.push(this.getTextLabel($(item)));
                    $(item).prop('checked', true);
                });
            }
        }

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