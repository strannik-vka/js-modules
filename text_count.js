var text_count = {

    init: function () {
        $(document)
            .on('reset', 'form', text_count.formReset)
            .on('input change', '[data-input-count]', text_count.change);
        text_count.fill();
    },

    formReset: function () {
        setTimeout(() => {
            $(this).find('[data-input-count]').trigger('change');
        }, 500);
    },

    fill: function () {
        $('[data-input-count]').each(function () {
            text_count.set(
                $('[data-output-count="' + $(this).attr('name') + '"]'),
                text_count.count($(this))
            );
        });
    },

    change: function () {
        text_count.set(
            $('[data-output-count="' + $(this).attr('name') + '"]'),
            text_count.count($(this))
        );
    },

    set: function (elem, count) {
        elem.text(count);

        var max = parseFloat(elem.attr('data-max-count'));

        if (count > max) {
            elem.addClass('higher');
        } else {
            elem.removeClass('higher');
        }
    },

    count: function (elem) {
        let result = 0;

        if (elem.attr('data-split-count')) {
            let val = $.trim(elem.val());
            result = val.split(elem.attr('data-split-count'));
            result = result.filter(item => item);
            result = result.length;
        } else {
            result = $.trim(elem.val()).replace(/\n/g, '\n\r').length;
        }

        return result;
    }

}

$(text_count.init);