class FormFill {

    constructor(form, data) {
        this.form = form;
        this.data = data;

        if (form.length && typeof data === 'object' && data != null) {
            this.fill();
        }
    }

    getFileName({ url, storageName }) {
        if (url) {
            if (storageName) {
                return storageName;
            }

            let urlArr = url.split('/');
            return urlArr[urlArr.length - 1];
        }

        return null;
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
                    let nameElem = $('[file-change-name="' + name + '"]'),
                        fileName = this.getFileName({
                            name: this.data[name],
                            storageName: nameElem.attr('data-storage-name')
                        });

                    nameElem.html('<a target="_blank" data-storage-file href="' + this.data[name] + '"><span class="file-delete" delete></span>' + fileName + '</a>');
                } else {
                    input.val(this.data[name]);
                }
            }

            input.trigger('change');
        });
    }

}

export default FormFill;