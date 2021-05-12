(function($) {
    $.mlp = { x: 0, y: 0 }; // Mouse Last Position
    $.fn.ismouseover = function() {
        var result = false;
        this.eq(0).each(function() {
            var $current = $(this);
            var offset = $current.offset();
            result = offset.left <= $.mlp.x && offset.left + $current.outerWidth() > $.mlp.x &&
                offset.top <= $.mlp.y && offset.top + $current.outerHeight() > $.mlp.y;
        });
        return result;
    };
})(jQuery);