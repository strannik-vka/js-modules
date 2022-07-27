let ajaxProcess = false,
    nextUrl = $('[rel="next"]').attr('href'),
    count = 1,
    limit = 50;

const loadNextPost = () => {
    ajaxProcess = true;

    $.get(nextUrl, html => {
        let htmls = [];

        html = '<div>' + html + '</div>';

        $('[data-clone-elem]', html).each(function () {
            htmls.push($(this).clone());
        });

        $('[data-clone-elem]:eq(-1)').append(htmls);

        nextUrl = $('[rel="next"]', html).attr('href');

        count++;

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