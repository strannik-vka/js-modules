// cursorStatus.create(elem)

window.cursorStatus = {

    timer: false,

    isLeftHalf_old: false,
    hoverElem: false,

    mousemoveHref: function (event, options) {
        $(options.cursor).hide();

        var elem = $(document.elementFromPoint(event.clientX, event.clientY));

        if (elem[0].tagName != 'A') {
            $(options.cursor).show();
        }
    },

    create: function (elem, options) {
        var cursor = {
            height: options.cursor ? $(options.cursor).height() / 2 : 0,
            width: options.cursor ? $(options.cursor).width() / 2 : 0
        }

        var elemMouseMove = function (this_elem) {
            this_elem.on('mousemove', function () {
                $(this).off('mousemove');
                setTimeout(function () {
                    bodyMouseMove(this_elem);
                }, 0);
            });
        }

        var bodyMouseMove = function (this_elem) {
            $('body').on('mousemove', function (event) {
                if (options.cursor) {
                    $(options.cursor).css({
                        top: event.clientY - cursor.height,
                        left: event.clientX - cursor.width
                    });

                    cursorStatus.mousemoveHref(event, options);
                }

                if (!cursorStatus.timer) {
                    cursorStatus.timer = setTimeout(function () {
                        cursorStatus.changeClass(this_elem, event);
                        cursorStatus.elemHover(options, event);

                        if (this_elem.isMouseOver(event.pageY)) {
                            $('body').removeClass('cursor-off');
                        } else {
                            $('body').addClass('cursor-off').off('mousemove');
                            setTimeout(function () {
                                elemMouseMove(this_elem);
                            }, 0);
                        }

                        cursorStatus.timer = false;
                    }, 100);
                }
            });
        }

        elemMouseMove(elem);

        cursorStatus.elemClick(elem, options);
    },

    bodyTriggerMousemoveTimer: false,
    bodyTriggerMousemove: function (eventClick) {
        if (cursorStatus.bodyTriggerMousemoveTimer) {
            clearTimeout(cursorStatus.bodyTriggerMousemoveTimer);
        }

        cursorStatus.bodyTriggerMousemoveTimer = setTimeout(function () {
            var event = $.Event('mousemove');
            event.pageX = eventClick.pageX;
            event.pageY = eventClick.pageY;
            $('body').trigger(event);
        }, 500);
    },

    elemClickTimer: false,
    elemClick: function (elem, options) {
        if (typeof options.on === 'object' && options.on != null) {
            if (options.on.click) {
                if (options.cursor) {
                    $(options.cursor).on('click', function (event) {
                        $(this).hide();
                        cursorStatus.hoverElem = document.elementFromPoint(event.clientX, event.clientY);
                        $(this).show();

                        if (elem.isMouseOver(event.pageY)) {
                            options.on.click(elem.eq(isMouseOverI));
                            cursorStatus.bodyTriggerMousemove(event);
                        }
                    });
                } else {
                    elem.on('click', function () {
                        options.on.click(elem);
                        cursorStatus.bodyTriggerMousemove(event);
                    });
                }
            }
        }
    },

    elemHoverIndex: 0,
    elemHover: function (options, event) {
        if (options.hover) {
            if ($(options.hover).isMouseOver(event.pageY, event.pageX)) {
                var elem = $(options.hover).eq(isMouseOverI);

                if (!elem.hasClass('hover')) {
                    cursorStatus.elemHoverIndex++;

                    $(options.hover).eq(isMouseOverI)
                        .addClass('hover')
                        .attr('data-cursor-index', cursorStatus.elemHoverIndex);

                    $('[data-cursor-index!="' + cursorStatus.elemHoverIndex + '"]').removeClass('hover');
                }
            } else {
                $('[data-cursor-index]').removeClass('hover');
            }
        }
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

        return cursorStatus.isLeftHalf_old = event.pageX < document_half;
    }

}