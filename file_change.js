/* 
    - После выбора файла отображает имя [name-preview="name"] 
    - После нажатия на хрестик удаление файла [file-change-name] [delete]
*/

var jsChange = false,
    jsClick = false;

$(document)
    .on('reset', 'form', (e) => {
        $(e.currentTarget).find('[file-change-name] [delete]').click();
    })
    .on('change', '[type="file"]', function () {
        var names = [],
            parent = $(this).parents('.input-group, [file-group]'),
            name_elem = parent.length
                ? parent.find('[file-change-name="' + $(this).attr('name') + '"]')
                : $('[file-change-name="' + $(this).attr('name') + '"]');

        if (name_elem.find('[data-storage-file]').length) {
            parent.find('label').addClass('label-up');
            parent.addClass('active');
            return false;
        }

        if (jsChange) {
            jsChange = false;
            return false;
        }

        if (typeof $(this)[0].files !== 'undefined') {
            $.each($(this)[0].files, function (i, file) {
                names.push(file.name);
            });
        }

        if (!name_elem.attr('text-original')) {
            name_elem.attr('text-original', name_elem.text());
        }

        if (names.length) {
            name_elem.html('<span class="file-delete" delete></span><span class="file-names" data-storage-file>' + names.join(', ') + '</span>');

            parent.addClass('active');
        } else {
            parent.removeClass('active');
        }
    })
    .on('click', '[type="file"]', function () {
        let parent = $(this).parents('.input-group, [file-group]');

        if (parent.length) {
            parent.attr('data-focus', 'true');
        }
    })
    .on('click', '[file-change-name]', function () {
        setTimeout(() => {
            let parent = $(this).parents('.input-group, [file-group]');

            if ((!parent.hasClass('active') && !parent.attr('data-focus')) || jsClick) {
                jsClick = true;
                parent.find('input').trigger('click');
            }
        }, 500);
    })
    .on('click', '[file-change-name] [delete]', function (e) {
        e.preventDefault();

        var parent = $(this).parents('.input-group, [file-group]'),
            input = parent.find('input[type="file"]'),
            name_elem = $(this).parents('[file-change-name]'),
            input = parent.length
                ? parent.find('[name="' + name_elem.attr('file-change-name') + '"]')
                : $('[name="' + name_elem.attr('file-change-name') + '"]');

        if (input.attr('disabled')) {
            return false;
        }

        name_elem.html(name_elem.attr('text-original') ? name_elem.attr('text-original') : '');

        parent.removeClass('active');
        input.removeAttr('data-is-file');
        input.replaceWith(input.clone().val(''));

        jsChange = true;

        parent.find('input[type="file"]').trigger('change').trigger('input');

        return false;
    });