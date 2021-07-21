custom_checkbox = {
    init: function () {
        var customCheckbox = $('[custom-checkbox]');

        customCheckbox.on('click', function () {

            if ($(this).find('[custom-checkbox-input]').is(':checked')) {
                $(this).find('[custom-checkbox-input]').prop('checked', false);
            } else {
                $(this).find('[custom-checkbox-input]').prop('checked', true);
            }
        });
    }
}

$(custom_checkbox.init)