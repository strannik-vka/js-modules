window.validate = {

    initOn: false,

    init: function () {
        validate.initOn = true;
        $(document).on('keyup change', '.is-invalid, .is-invalid *, .selectized', function () {
            $(this).removeClass('is-invalid');
            $('[data-error-input="' + $(this).attr('name') + '"]')
                .parents('.is-invalid')
                .removeClass('is-invalid');
            $('[data-error-input="' + $(this).attr('name') + '"]').remove();
        });
    },

    scroll: function (elem) {
        if ($('.modal.show').length > 0) return false;

        var scrollTop = (
            elem.css('display') == 'none' ?
                elem.parent().offset().top - 25 : elem.offset().top - 25
        );

        $('html, body').animate({
            scrollTop: scrollTop
        }, 300);
    },

    error: function (key, string, form) {
        if(!validate.initOn) validate.init();

        form = typeof form !== 'undefined' ? form : $('body');

        var error_elem = form.find('[name="' + key + '"]:eq(0)').length 
            ? form.find('[name="' + key + '"]:eq(0)')
            : form.find('[name^="' + key + '["]:eq(0)');

        if(!error_elem.length && key.indexOf('.') > -1){
            var str_arr = key.split('.');
            error_elem = form.find('[name="' + str_arr[0] + '['+ str_arr[1] +']"]:eq(0)');
        }

        if (error_elem.length) {
            $('[data-error-input="' + key + '"]').remove();
            error_elem
                .addClass('is-invalid')
                .after('<div data-error-input="' + key + '" class="invalid-feedback">' + (typeof string === 'object' ? string.join('<br>') : string) + '</div>');
            return true;
        } else {
            return false;
        }
    },

    errors: function(response_errors, form){
        if(!validate.initOn) validate.init();

        var errors = [];

        $.each(response_errors, function (key, val) {
            if (!validate.error(key, val, form)) {
                errors.push(val);
            }
        });

        if(errors.length){
            alert(errors.join(', '));
        }

        if($('.is-invalid').length){
            validate.scroll($('.is-invalid:eq(0)'));
        }
    }

}