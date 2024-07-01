$(() => {
    const csrf = $('[name="csrf-token"]').length ? $('[name="csrf-token"]').attr('content') : null;

    if (csrf) {
        $(document).on('focus', 'form [name]', (e) => {
            const form = $(e.currentTarget).parents('form');

            if (form.find('[name="_token"]').length == 0) {
                form.prepend('<input type="hidden" name="_token" value="' + csrf + '">');
            }
        })
    }
})