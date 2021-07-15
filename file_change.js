/* 
    - После выбора файла отображает имя [name-preview="name"] 
    - После нажатия на хрестик удаление файла [file-change-name] [delete]
*/

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

        $.each($(this)[0].files, function (i, file) {
            names.push(file.name);
        });

        if (!name_elem.attr('text-original')) {
            name_elem.attr('text-original', name_elem.text());
        }

        name_elem.html('<span class="file-delete" delete></span>' + names.join(', '));

        if (names.length) {
            parent.addClass('active');
        } else {
            parent.removeClass('active');
        }
    })
    .on('click', '[file-change-name] [delete]', function (e) {
        e.preventDefault();

        var parent = $(this).parents('.input-group, [file-group]'),
            input = parent.find('input[type="file"]'),
            name_elem = $(this).parents('[file-change-name]'),
            input = parent.length
                ? parent.find('[name="' + name_elem.attr('file-change-name') + '"]')
                : $('[name="' + name_elem.attr('file-change-name') + '"]');

        name_elem.html(name_elem.attr('text-original'));

        parent.removeClass('active');
        input.replaceWith(input.clone().val(''));
        parent.find('input[type="file"]').trigger('change');

        return false;
    });