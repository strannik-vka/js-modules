// cursorStatus.create(elem)

window.cursorStatus = {

    timer: false,

    isLeftHalf_old: false,

    create: function (elem, options) {
        var cursor = {
            height: options.cursor ? $(options.cursor).height() / 2 : 0,
            width: options.cursor ? $(options.cursor).width() / 2 : 0
        }

        var elemMouseMove = function (this_elem) {
            this_elem.on('mousemove', function () {
                $(this).off('mousemove');
                bodyMouseMove(this_elem);
            });
        }

        var bodyMouseMove = function (this_elem) {
            $('body').on('mousemove', function (event) {
                if (options.cursor) {
                    $(options.cursor).css({
                        top: event.clientY - cursor.height,
                        left: event.clientX - cursor.width
                    });
                }

                if (!cursorStatus.timer) {
                    cursorStatus.timer = setTimeout(function () {
                        cursorStatus.changeClass(this_elem, event);

                        if (this_elem.isMouseOver(event.pageY)) {
                            $('body').removeClass('cursor-off');
                        } else {
                            $('body').addClass('cursor-off').off('mousemove');
                            elemMouseMove(this_elem);
                        }

                        cursorStatus.timer = false;
                    }, 100);
                }
            });
        }

        elem.each(function () {
            var this_elem = $(this);

            elemMouseMove(this_elem);

            if (typeof options.on === 'object' && options.on != null) {
                if (options.on.click) {
                    if (options.cursor) {
                        $(options.cursor).on('click', function (event) {
                            if (this_elem.isMouseOver(event.pageY)) {
                                options.on.click(this_elem);
                            }
                        });
                    } else {
                        this_elem.on('click', function () {
                            options.on.click(this_elem);
                        });
                    }
                }
            }
        });
    },

    changeClass: function (elem, event) {
        var left = cursorStatus.isLeftHalf(elem, event);

        if (left) {
            $('body').addClass('cursor-left');
            $('body').removeClass('cursor-right');
        } else {
            $('body').removeClass('cursor-left');
            $('body').addClass('cursor-right');
        }

        var cursor_color = 'black';

        if ($('.black-block').isMouseOver(event.pageY, event.pageX)) {
            cursor_color = 'white';
        }

        if ($('.white').isMouseOver(event.pageY, event.pageX)) {
            cursor_color = 'black';
        } 
        
        if ($('.black').isMouseOver(event.pageY, event.pageX)) {
            cursor_color = 'white';
        }

        if (cursor_color == 'black') {
            $('body').addClass('cursor-black');
            $('body').removeClass('cursor-white');
        } else {
            $('body').addClass('cursor-white');
            $('body').removeClass('cursor-black');
        }
    },

    isLeftHalf: function (elem, event) {
        var document_width = $(elem).width(),
            document_half = document_width / 2;

        return cursorStatus.isLeftHalf_old = event.clientX < document_half;
    }

}