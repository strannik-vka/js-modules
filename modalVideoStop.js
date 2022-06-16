$(document).on('hidden.bs.modal', '.modal', function () {
    $(this).find('iframe video').each(function () {
        let clone = $(this).clone();

        if (clone.hasClass('lazyloaded')) {
            clone.removeClass('lazyloaded');
            clone.attr('src', clone.attr('data-src'));
        }

        $(this).after(clone).remove();
    });
});