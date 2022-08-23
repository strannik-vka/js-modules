const getValue = (input, form) => {
    if (input.attr('type') == 'radio') {
        input = form.find('[name="' + input.attr('name') + '"]:checked');
    }

    return $.trim(input.val());
}

export default (form) => {
    let all = 0, success = 0, radios = [];

    form.find('[name]').each((i, item) => {
        let input = $(item),
            name = input.attr('name'),
            val = getValue(input, form);

        if (input.attr('type') == 'hidden' || input.attr('readonly') || input.attr('disabled')) {
            return true;
        }

        if (input.attr('type') == 'radio') {
            if (radios.indexOf(name) > -1) {
                return true;
            }

            radios.push(name);
        }

        if (val) {
            success++;
        }

        all++;
    });

    return {
        all: success && all ? Math.ceil(100 / (all / success)) : 0
    }
}