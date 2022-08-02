$(document).on('click', '[data-href]', function () {
    location.href = $(this).attr('data-href');
});