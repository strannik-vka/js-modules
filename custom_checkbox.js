custom_checkbox = {
    init: function () {
        var customCheckbox = $('[custom-checkbox]');

        customCheckbox.on('click', 'customCheckbox', function () {
            $(this).find('[custom-checkbox-input]').trigger('click');
            return false;
        });
    }
}

$(custom_checkbox.init)