$(document).on('hidden.bs.modal', '.modal', function () {
    $(this).find('iframe').each(function () {
        $(this).after($(this).removeClass('lazyloaded').clone()).remove();
    });

    $(this).find('video').each(function () {
        $(this).after($(this).removeClass('lazyloaded').clone()).remove();
    });
});