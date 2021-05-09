window.caruselCursor = {

    timer: false,

    create: function (elem) {
        elem.each(function () {
            var this_elem = $(this);

            this_elem.on('mousemove', function (event) {
                if (!caruselCursor.timer) {
                    caruselCursor.timer = setTimeout(function () {
                        caruselCursor.statusClass(this_elem, event);

                        caruselCursor.timer = false;
                    }, 100);
                }
            });
        });
    },

    statusClass: function (elem, event) {
        var left = caruselCursor.isLeftHalf(elem, event);

        if (left) {
            elem.addClass('cursor-left');
            elem.removeClass('cursor-right');
        } else {
            elem.removeClass('cursor-left');
            elem.addClass('cursor-right');
        }

        var cursor_color = 'black';

        if ($(event.target).closest('.black-block').length) {
            cursor_color = 'white';
        }

        if ($(event.target).closest('.white').length) {
            cursor_color = 'black';
        }

        if ($(event.target).closest('.black').length) {
            cursor_color = 'white';
        }

        if (cursor_color == 'black') {
            elem.addClass('cursor-black');
            elem.removeClass('cursor-white');
        } else {
            elem.addClass('cursor-white');
            elem.removeClass('cursor-black');
        }
    },

    isLeftHalf: function (elem, event) {
        var document_width = $(elem).width(),
            document_half = document_width / 2;

        return event.clientX < document_half;
    }

}