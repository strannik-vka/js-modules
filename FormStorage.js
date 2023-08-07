class FormStorage {

    constructor() {
        $(document)
            .on('input', '[data-form-storage] [name]', this.onChange)
            .on('keydown', '[data-form-storage] [class*="mask-"][name]', this.onChange)
            .on('keydown', '[data-form-storage] [data-is-mask][name]', this.onChange)
            .on('change', '[data-form-storage] select[name]', this.onChange)
            .on('ajax-response-success', '[data-form-storage]', this.clearInputs);

        $('[data-form-storage]').each((i, form) => {
            this.formFill(this.getFormId($(form)));
        });
    }

    getFormId = (form) => {
        return form.attr('data-form-storage')
            ? form.attr('data-form-storage')
            : form.attr('id');
    }

    formFill = (formId) => {
        let inputs = this.getInputs(formId),
            form = $('#' + formId).length ? $('#' + formId) : $('[data-form-storage="' + formId + '"]');

        $.each(inputs, (name, val) => {
            if (Array.isArray(val)) {
                val.forEach(value => {
                    var input = form.find('[name="' + name + '"][value="' + value + '"]');

                    if (input.length) {
                        input.prop('checked', true).trigger('change');
                    }
                })
            } else {
                var input = form.find('[name="' + name + '"]');

                if (input.length) {
                    if (input[0].tagName == 'select') {
                        input.find('option').prop('selected', false);
                        input.find('option[value="' + val + '"]').prop('selected', true);
                    } else if (input.attr('type') == 'checkbox') {
                        form.find('[name="' + name + '"][value="' + val + '"]').prop('checked', true).trigger('change');
                    } else if (input.attr('type') == 'radio') {
                        form.find('[name="' + name + '"][value="' + val + '"]').prop('checked', true).trigger('change');
                    } else if (input.attr('type') != 'file') {
                        input.val(val).trigger('change');
                    }
                }
            }
        });

        if (Object.keys(inputs).length) {
            setTimeout(() => {
                form.trigger('form-storage-fill');
            }, 1000);
        } else {
            setTimeout(() => {
                form.trigger('form-storage-empty');
            }, 1000);
        }
    }

    onChange = (e) => {
        let form = $(e.currentTarget).parents('form'),
            formId = this.getFormId(form),
            inputs = this.getInputs(formId);

        let name = $(e.currentTarget).attr('name'),
            val = $(e.currentTarget).val();

        if (name.indexOf(']') > -1) {
            if (!Array.isArray(inputs[name])) {
                inputs[name] = [];
            }

            if (inputs[name].indexOf(val) > -1) {
                inputs[name].splice(inputs[name].indexOf(val), 1);
            } else {
                inputs[name].push(val);
            }
        } else {
            if ($(e.currentTarget).attr('type') == 'checkbox') {
                if ($(e.currentTarget).prop('checked')) {
                    inputs[name] = val;
                } else {
                    if (typeof inputs[name] !== 'undefined') {
                        delete inputs[name];
                    }
                }
            } else {
                inputs[name] = val;
            }
        }

        localStorage.setItem('form_' + formId, JSON.stringify(inputs));
    }

    getInputs = (formId) => {
        let inputs = localStorage.getItem('form_' + formId);
        return inputs !== null ? JSON.parse(inputs) : {};
    }

    clearInputs = (e) => {
        let form = $(e.currentTarget),
            formId = this.getFormId(form);

        localStorage.removeItem('form_' + formId);
    }

}

new FormStorage();