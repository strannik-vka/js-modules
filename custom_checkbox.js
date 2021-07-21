var customCheckbox = $('[custom-checkbox]');

custom_checkbox = {
    init: function () {
        customCheckbox.trigger('click', 'customCheckbox', function () {
            $(this).find('[custom-checkbox-input]').prop('checked', true);
        });
    }
}

$(custom_checkbox.init)