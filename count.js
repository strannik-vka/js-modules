var count = $('[count-numbers]');

$(function () {
    count.each(function () {
        $(this).prop('Counter', 0)
            .css('opacity', '1')
            .animate({
                Counter: $(this).text()
            }, {
                duration: 3500,
                easing: 'swing',
                step: function (now) {
                    $(this).text(commaSeparateNumber(Math.ceil(now)));
                }
            });
    });

    function commaSeparateNumber(val) {
        while (/(\d+)(\d{3})/.test(val.toString())) {
            val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ' ' + '$2');
        }
        return val;
    }
});