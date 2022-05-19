class FormFill {

    constructor(form, data) {
        this.form = form;
        this.data = data;

        this.fill();
    }

    fill() {
        let ObjectKeys = Object.keys(this.data);

        ObjectKeys.forEach(name => {
            let input = this.form.find('[name="' + name + '"]');

            if (input.length) {
                if (input[0].tagName == 'SELECT') {
                    input.find('[value="' + this.data[name] + '"]').attr('selected', 'true');
                } else if (input.attr('type') == 'checkbox') {
                    this.form.find('[name="' + name + '"][value="' + this.data[name] + '"]').prop('checked', true);
                } else if (input.attr('type') == 'radio') {
                    this.form.find('[name="' + name + '"][value="' + this.data[name] + '"]').prop('checked', true);
                } else if (input.attr('type') == 'file') {

                } else {
                    input.val(this.data[name]);
                }
            }
        });
    }

}

export default FormFill;