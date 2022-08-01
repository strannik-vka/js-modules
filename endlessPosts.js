let ajaxProcess = false,
    nextUrl = $('[rel="next"]').attr('href'),
    count = 1,
    limit = 50;

const loadNextPost = () => {
    ajaxProcess = true;

    $('[data-ep-preloader]').show();

    $.get(nextUrl, html => {
        let htmls = [];

        html = '<div>' + html + '</div>';

        $('[data-clone-elem]', html).each(function () {
            htmls.push($(this).clone());
        });

        $('[data-clone-elem]:eq(-1)').after(htmls);

        nextUrl = $('[rel="next"]', html).attr('href');

        count++;

        $('[data-ep-preloader]').hide();

        $(document).trigger('afterLoadNextPost');

        ajaxProcess = false;
    });
}

const isPageEnd = () => {
    return $(window).height() + $(window).scrollTop() >= $('main').height() - 300;
}

$(window).on('scroll', () => {
    if (isPageEnd() && ajaxProcess == false && nextUrl && count < limit) {
        loadNextPost();
    }
})