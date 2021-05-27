$('input.form-control, input.form-type-text, textarea.form-type-text').each(function() {
    if ($(this).prev().length) {
        if ($(this).prev()[0].tagName == 'LABEL' && $.trim($(this).val())) {
            $(this).prev().addClass('label-up');
        }
    }
});

$(document)
    .on('change', 'input[type="file"]', function() {
        if ($(this).prev().length) {
            if ($(this).prev()[0].tagName == 'LABEL' && $.trim($(this).val())) {
                $(this).prev().addClass('label-up');
            } else {
                $(this).prev().removeClass('label-up');
            }
        }
    })
    .on('focus', 'input.form-control, input.form-type-text, textarea.form-type-text', function() {
        if ($(this).prev().length) {
            if ($(this).prev()[0].tagName == 'LABEL') {
                $(this).prev().addClass('label-up');
            }
        }
    })
    .on('blur', 'input.form-control, input.form-type-text, textarea.form-type-text', function() {
        if ($(this).prev().length) {
            if ($(this).prev()[0].tagName == 'LABEL' && !$.trim($(this).val())) {
                $(this).prev().removeClass('label-up');
            }
        }
    });