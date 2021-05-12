(function ($) {
    $.fn.isMouseOver = function (y, x) {
        var result = false;
        this.each(function (i) {
            var offset = $(this).offset();

            if (x) {
                result = offset.left <= x && offset.left + $(this).outerWidth() > x &&
                    offset.top <= y && offset.top + $(this).outerHeight() > y;
            } else {
                result = offset.top <= y && offset.top + $(this).outerHeight() > y;
            }

            if (result) {
                window.isMouseOverI = i;
                return false;
            }
        });
        return result;
    };
})(jQuery);