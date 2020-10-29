$('.owl-carousel').each(function (i) {
    $(this).attr('data-index', i);
});

$('.owl-carousel').on('changed.owl.carousel', function (event) {
    var id = $(this).attr('data-index'), current = event.item.index + 1;
    $('[carousel-page-id="' + id + '"], [carousel-page]:eq('+ id +')').html(current);
    $(event.currentTarget).find('[carousel-page]').html(current);
}).on('initialized.owl.carousel', function (event) {
    var elem = $(this);
    setTimeout(function () {
        var id = elem.attr('data-index');
        $('[carousel-total-page-id="' + id + '"], [carousel-total-page]:eq('+ id +')').html(event.item.count);
        elem.find('[carousel-total-page]').html(event.item.count);
    }, 500);
});

$('.modal').on('hidden.bs.modal', function () {
    if ($(this).find('.owl-carousel').length) {
        $(this).find('.owl-carousel').trigger('destroy.owl.carousel');
    }
});