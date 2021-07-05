var method = {

    each: function (form) {
        form.find('input.form-control, input.form-type-text, textarea.form-type-text').each(function () {
            if ($(this).prev().length) {
                if ($(this).prev()[0].tagName == 'LABEL' && method.val($(this))) {
                    $(this).prev().addClass('label-up');
                } else {
                    $(this).prev().removeClass('label-up');
                }
            }
        });
    },

    val: (elem) => {
        var val = $.trim(elem.val());

        if (val) {
            val = val.replace('__:__', '');
        }

        return val;
    }

}

setTimeout(function () {
    method.each($('body'));
}, 600);

$(document)
    .on('change', 'input[type="file"]', function () {
        if ($(this).prev().length) {
            if ($(this).prev()[0].tagName == 'LABEL' && $method.val($(this))) {
                $(this).prev().addClass('label-up');
            } else {
                $(this).prev().removeClass('label-up');
            }
        }
    })
    .on('focus', 'input.form-control, input.form-type-text, textarea.form-type-text', function () {
        if ($(this).prev().length) {
            if ($(this).prev()[0].tagName == 'LABEL') {
                $(this).prev().addClass('label-up');
            }
        }
    })
    .on('blur', 'input.form-control, input.form-type-text, textarea.form-type-text', function () {
        if ($(this).prev().length) {
            if ($(this).prev()[0].tagName == 'LABEL' && !method.val($(this))) {
                $(this).prev().removeClass('label-up');
            }
        }
    })
    .on('reset', 'form', function () {
        var form = $(this);

        setTimeout(function () {
            method.each(form);
        }, 500);
    });