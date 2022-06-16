const videoReplace = (video) => {
    let clone = video.clone();

    if (clone.hasClass('lazyloaded')) {
        clone.removeClass('lazyloaded');
        clone.attr('src', clone.attr('data-src'));
    }

    video.after(clone).remove();
}

$(document).on('hidden.bs.modal', '.modal', function () {
    $(this).find('iframe, video').each(function () {
        videoReplace($(this));
    });
});