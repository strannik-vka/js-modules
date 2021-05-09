window.caruselCursor = {

    timer: false,

    isLeftHalf_old: false,

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

            if (this_elem.find('.swiper-container').length) {
                this_elem.find('.swiper-container').on('click', function () {
                    var swiper = $(this)[0].swiper;

                    if (caruselCursor.isLeftHalf_old) {
                        swiper.slidePrev();
                    } else {
                        swiper.slideNext();
                    }
                });
            }
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

        return caruselCursor.isLeftHalf_old = event.clientX < document_half;
    }

}