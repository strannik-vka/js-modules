var text_count = {

    init: function() {
        $(document).on('input', '[data-input-count]', text_count.change);
        text_count.fill();
    },

    fill: function() {
        $('[data-input-count]').each(function() {
            text_count.set(
                $('[data-output-count="' + $(this).attr('name') + '"]'),
                text_count.count($(this))
            );
        });
    },

    change: function() {
        text_count.set(
            $('[data-output-count="' + $(this).attr('name') + '"]'),
            text_count.count($(this))
        );
    },

    set: function(elem, count) {
        elem.text(count);

        var max = parseFloat(elem.attr('data-max-count'));

        if (count > max) {
            elem.addClass('higher');
        } else {
            elem.removeClass('higher');
        }
    },

    count: function(elem) {
        return $.trim(elem.val()).replace(/\n/g, '\n\r').length;
    }

}

$(text_count.init);