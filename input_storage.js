window.input_storage = {

    init: function () {
        $(document).on('input', '[data-storage]', input_storage.change);
        $(document).on('keydown', '[class*="mask-"][data-storage]', input_storage.change);
        $(document).on('change', 'select[data-storage]', input_storage.change);
        input_storage.fill();
    },

    clear: function () {
        localStorage.removeItem('inputs');
    },

    fill: function () {
        var inputs = input_storage.get();

        $.each(inputs, function (name, val) {
            var input = $('[data-storage][name="' + name + '"]');

            if (input.length) {
                if (input.attr('type') == 'checkbox') {
                    input.find('option').prop('selected', false);
                    input.find('option[value="' + val + '"]').prop('selected', true);
                } else if (input.attr('type') == 'radio') {
                    $('[data-storage][name="' + name + '"][value="' + val + '"]').prop('checked', true).trigger('change');
                } else {
                    input.val(val);
                }
            }
        });
    },

    change: function () {
        input_storage.save($(this).attr('name'), $.trim($(this).val()));
    },

    save: function (key, val) {
        var inputs = input_storage.get();
        inputs[key] = val;
        localStorage.setItem('inputs', JSON.stringify(inputs));
    },

    get: function () {
        var inputs = localStorage.getItem('inputs');
        return inputs !== null ? JSON.parse(inputs) : {};
    }

}

$(input_storage.init);