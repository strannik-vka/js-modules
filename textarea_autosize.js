window.textarea_autosize = {

    init: function () {
        $('textarea[data-autosize]').each(function () {
            textarea_autosize.resize($(this));
        });

        $(document)
            .on('shown.bs.modal', '.modal', function () {
                $('textarea[data-autosize]').each(function () {
                    textarea_autosize.resize($(this));
                });
            })
            .on('input change', 'textarea[data-autosize]', function () {
                textarea_autosize.resize($(this));
            });

        document.addEventListener('DOMSubtreeModified', function () {
            $('textarea[data-autosize]:not([data-autosize="true"])').each(function () {
                textarea_autosize.resize($(this));
            });
        });
    },

    resize: function (elem) {
        if (elem && elem.length) {
            elem.css('height', 'auto').css('height', (elem[0].scrollHeight + 5) + 'px');

            if (elem.attr('data-autosize') != 'true') {
                elem.attr('data-autosize', 'true');
            }
        }
    }

}

$(textarea_autosize.init);