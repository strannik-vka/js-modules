window.entry_modal = {

    data: {},

    set: function (model) {
        entry_modal.data[model.name] = model;
        entry_modal.url(model);
        $(document).on('click', '[' + model.name + '-open]', function () {
            var entry_id = $(this).attr(model.name + '-open');
            model.data(entry_id, function (json) {
                entry_modal.open(model, json);
            });
        });
        $(document).on('hidden.bs.modal', '[entry-modal]', function () {
            history.pushState(null, null, location.pathname);
        });
    },

    url: function (model) {
        if (location.href.indexOf(model.name + '=') > -1) {
            var url = new URL(location.href),
                entry_id = url.searchParams.get(model.name);
            model.data(entry_id, function (data) {
                if (data || typeof data === 'object') {
                    entry_modal.open(model, data);
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

        model.html(modal, data);

        modal.modal('show');
    }

}