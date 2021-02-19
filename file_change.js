/* 
    - После выбора файла отображает имя [name-preview="name"] 
    - После нажатия на хрестик удаление файла [file-change-name] [delete]
*/

$(document)
    .on('change', '[type="file"]', function () {
        var names = [], name_elem = $('[file-change-name="' + $(this).attr('name') + '"]');

        $.each($(this)[0].files, function (i, file) {
            names.push(file.name);
        });

        if (!name_elem.attr('text-original')) {
            name_elem.attr('text-original', name_elem.text());
        }

        name_elem.html('<span class="file-delete" delete></span>' + names.join(', '));

        if (names.length) {
            $(this).parents('.input-group').addClass('active');
        } else {
            $(this).parents('.input-group').removeClass('active');
        }
    })
    .on('click', '[file-change-name] [delete]', function (e) {
        e.preventDefault();

        var name_elem = $(this).parents('[file-change-name]'),
            input = $('[name="' + name_elem.attr('file-change-name') + '"]');

        name_elem.html(name_elem.attr('text-original'));

        input.parents('.input-group').removeClass('active');
        input.replaceWith(input.clone().val(''));

        return false;
    });