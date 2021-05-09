window.caruselCursor = {

    timer: false,

    isLeftHalf_old: false,

    create: function (elem, {
        container: container
    }) {
        if ($(window).width() >= 576) {
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
                    var swiper = this_elem[0].querySelector('.swiper-container').swiper,
                        container_left = (container.offset().left + 15);

                    this_elem.find('.swiper-container').on('click', function () {
                        if (caruselCursor.isLeftHalf_old) {
                            swiper.slidePrev();
                        } else {
                            swiper.slideNext();
                        }
                    });


                    swiper.on('slideChange', function () {
                        if (caruselCursor.isLeftHalf_old) {
                            if (swiper.realIndex == 0) {
                                this_elem.animate({
                                    'padding-left': container_left + 'px'
                                }, 0);
                            }
                        } else {
                            if (swiper.realIndex > 0) {
                                this_elem.animate({
                                    'padding-left': 0
                                }, 0);
                            }
                        }
                    });

                    this_elem.css('padding-left', container_left + 'px');
                }
            });
        }
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