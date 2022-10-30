window.textarea_autosize = {

    init: function () {
        textarea_autosize.resize($('textarea[data-autosize]'));

        $(document)
            .on('shown.bs.modal', '.modal', function () {
                textarea_autosize.resize($(this).find('textarea[data-autosize]'));
            })
            .on('input change', 'textarea[data-autosize]', function () {
                textarea_autosize.resize($(this));
            });

        document.addEventListener('DOMSubtreeModified', function () {
            textarea_autosize.resize($('textarea[data-autosize]:not([data-autosize="true"])'));
        });
    },

    resize: function (elem) {
        if (elem && elem.length) {
            elem.css('height', 'auto').css('height', elem[0].scrollHeight + 'px');

            if (elem.attr('data-autosize') != 'true') {
                elem.attr('data-autosize', 'true');
            }
        }
    }

}

$(textarea_autosize.init);