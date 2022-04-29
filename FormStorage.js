class FormStorage {

    constructor() {
        $(document)
            .on('input', '[data-form-storage] [name]', this.onChange)
            .on('keydown', '[data-form-storage] [class*="mask-"][name]', this.onChange)
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
            var input = form.find('[name="' + name + '"]');

            if (input.length) {
                if (input.attr('type') == 'checkbox') {
                    input.find('option').prop('selected', false);
                    input.find('option[value="' + val + '"]').prop('selected', true);
                } else if (input.attr('type') == 'radio') {
                    form.find('[name="' + name + '"][value="' + val + '"]').prop('checked', true).trigger('change');
                } else {
                    input.val(val).trigger('change');
                }
            }
        });
    }

    onChange = (e) => {
        let form = $(e.currentTarget).parents('form'),
            formId = this.getFormId(form),
            inputs = this.getInputs(formId);

        let name = $(e.currentTarget).attr('name'),
            val = $(e.currentTarget).val();

        inputs[name] = val;

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