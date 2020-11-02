window.entryModal = {

    data: {},

    set: function (model) {
        entryModal.data[model.name] = model;
        entryModal.url(model);
        $(document).on('click', '[' + model.name + '-open]', function () {
            var entry_id = $(this).attr(model.name + '-open');
            model.data(entry_id, function (json) {
                entryModal.open(model, json);
            });
        });
        $(document).on('hide.bs.modal', '[entry-modal]', function () {
            history.pushState(null, null, location.pathname);
        });
    },

    url: function (model) {
        if (location.href.indexOf(model.name + '=') > -1) {
            var url = new URL(location.href),
                entry_id = url.searchParams.get(model.name);
            model.data(entry_id, function (data) {
                if (data || typeof data === 'object') {
                    entryModal.open(model, data);
                } else {
                    history.pushState(null, null, location.pathname);
                }
            });
        }
    },

    open: function (model, data) {
        if (data.id) {
            history.pushState(null, null, location.pathname + '?' + model.name + '=' + data.id);
        }

        var modal = $('[entry-modal="' + model.name + '"]');

        $.each(data, function (key, val) {
            modal.find('[' + model.name + '-' + key + ']').html(
                (
                    val && typeof val !== 'object'
                        ? val
                        : (model.empty ? model.empty : '')
                )
            );
        });

        model.html(modal, data);

        modal.modal('show');
    }

}