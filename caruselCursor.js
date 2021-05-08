window.caruselCursor = {

    timer: false,

    create: function (elem) {
        elem
            .on('mousemove', function (event) {
                if (!caruselCursor.timer) {
                    caruselCursor.timer = setTimeout(function () {
                        caruselCursor.statusClass(elem, event);

                        caruselCursor.timer = false;
                    }, 100);
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

        if ($(event.target).closest('.white').length || $(event.target).closest('.direction-item') || $(event.target).closest('.card-company')) {
            elem.removeClass('cursor-white');
            elem.addClass('cursor-black');
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