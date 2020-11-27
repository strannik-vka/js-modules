// После выбора файла отображает картинку [image-preview="name"]

$(document).on('change', '[type="file"]', function () {
    var img = $('[image-preview="' + $(input).attr('name') + '"]');
    if (input[0].files && input[0].files[0] && img.length) {
        var reader = new FileReader();
        reader.onload = function (e) {
            img.attr('src', e.target.result);
        };
        reader.readAsDataURL(input[0].files[0]);
    }
});