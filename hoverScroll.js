/*
    hoverScroll.create(elem, {
        half: true // делить экран на 2 части
    })
*/

window.hoverScroll = {

    timer: false,

    clientX_old: false,

    create: function (elem, options) {
        elem
            .on('mousemove', function (event) {
                if (!hoverScroll.timer) {
                    hoverScroll.timer = setTimeout(function () {
                        console.log(hoverScroll.isLeft(event));
                        console.log(hoverScroll.isLeftHalf($(this), event));

                        hoverScroll.timer = false;
                        hoverScroll.clientX_old = event.clientX;
                    }, 100);
                }
            })
            .on('mouseover', function () {

            });
    },

    isLeft: function (event) {
        if (hoverScroll.clientX_old === false) {
            return null;
        }

        return event.clientX < hoverScroll.clientX_old;
    },

    isLeftHalf: function (elem, event) {
        var document_width = $(elem).width(),
            document_half = document_width / 2;

        return event.clientX < document_half;
    }

}