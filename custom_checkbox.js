custom_checkbox = {
    init: function () {
        var customCheckbox = $('[custom-checkbox]');

        $(document).each('click', 'customCheckbox', function () {
            $(this).find('[custom-checkbox-input]').prop('checked', true);
        });
    }
}

$(custom_checkbox.init)