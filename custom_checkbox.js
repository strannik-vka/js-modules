var customCheckbox = $('[custom-checkbox]');

custom_checkbox = {
    init: function () {
        $(document).on('click', 'customCheckbox', function () {
            customCheckbox.find('[custom-checkbox-input]').prop('checked', true);
        });
    }
}

$(custom_checkbox.init)