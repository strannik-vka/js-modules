var customCheckbox = $('[custom-checkbox]');

custom_checkbox = {
    init: function () {
        customCheckbox.on('click', 'customCheckbox', function () {
            $(this).find('[custom-checkbox-input]').prop('checked', true);
        });
    }
}

$(custom_checkbox.init)