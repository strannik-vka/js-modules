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

        if (
            $(event.target).closest('.white').length ||
            $(event.target).closest('.direction-item').length ||
            $(event.target).closest('.card-company').length
        ) {
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