var share = {

    data: {
        facebook: 'https://www.facebook.com/sharer/sharer.php?u=URL',
        twitter: 'https://twitter.com/share?url=URL&text=TITLE',
        linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=URL',
        vk: 'https://vk.com/share.php?url=URL&title=TITLE',
        tg: 'https://telegram.me/share/url?url=URL&text=TITLE',
        ok: 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=URL'
    },

    social: function (name, url, title) {
        url = url ? url : window.location.href;
        title = title ? title : $('title').text();
        return share.data[name].replace('URL', encodeURIComponent(url)).replace('TITLE', title);
    },

    init: function () {
        $(document).on('click', '[share-link]', function () {
            var name = $(this).attr('share-link'),
                url = $(this).attr('share-url'),
                title = $(this).attr('share-title'),
                href = share.social(name, url, title);

            $('#share_link').remove();
            $('body').append('<a target="_blank" id="share_link" href="' + href + '" class="d-none"></a>');
            $('#share_link')[0].click();
        });
    }

}

$(share.init);