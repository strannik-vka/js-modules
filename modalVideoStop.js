$(document).on('hidden.bs.modal', '.modal', function () {
    $(this).find('iframe').each(function () {
        $(this).after($(this).clone()).remove();
    });
});