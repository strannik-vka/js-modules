// Отображение имени выбранного файла

$(document).on('change', '[type="file"]', function () {
    var names = [];

    $.each($(this)[0].files, function(i, file){
        names.push(file.name);
    });

    $('[file-change-name="'+ $(this).attr('name') +'"]').html(names.join(', '));

    if(names.length){
        $(this).parents('.input-group').addClass('active');
    } else {
        $(this).parents('.input-group').removeClass('active');
    }
});