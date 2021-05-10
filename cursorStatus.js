// cursorStatus.create(elem)

window.cursorStatus = {

    timer: false,

    isLeftHalf_old: false,

    create: function (elem, options) {
        elem.each(function () {
            var this_elem = $(this);

            this_elem.on('mousemove', function (event) {
                if (!cursorStatus.timer) {
                    cursorStatus.timer = setTimeout(function () {
                        cursorStatus.changeClass(this_elem, event);

                        cursorStatus.timer = false;
                    }, 100);
                }
            });

            if (typeof options.on === 'object' && options.on != null) {
                if (options.on.click) {
                    this_elem.on('click', options.on.click);
                }
            }
        });
    },

    changeClass: function (elem, event) {
        var left = cursorStatus.isLeftHalf(elem, event);

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

        return cursorStatus.isLeftHalf_old = event.clientX < document_half;
    }

}