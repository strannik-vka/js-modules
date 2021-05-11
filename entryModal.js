window.entryModal = {

    data: {},

    set: function (model) {
        model.pushState = typeof model.pushState !== 'undefined' ? model.pushState : true;

        entryModal.data[model.name] = model;
        entryModal.url(model);

        $(document)
            .on('click', '[' + model.name + '-open]', function () {
                var entry_id = $(this).attr(model.name + '-open');
                model.data(entry_id, function (json) {
                    entryModal.open(model, json);
                });
            })
            .on('hide.bs.modal', '[entry-modal]', function () {
                history.pushState(null, null, location.pathname);
            });
    },

    url: function (model) {
        if (location.href.indexOf(model.name + '=') > -1 && typeof $.url_get === 'function' && model.pushState) {
            var entry_id = $.url_get(model.name);

            if (ajaxProcess) {
                setTimeout(function () {
                    entryModal.url(model);
                }, 1000);
            } else {
                model.data(entry_id, function (data) {
                    if (data || typeof data === 'object') {
                        entryModal.open(model, data);
                    } else {
                        history.pushState(null, null, location.pathname);
                    }
                });
            }
        }
    },

    open: function (model, data) {
        if (data.id && model.pushState) {
            history.pushState(null, null, location.pathname + '?' + model.name + '=' + data.id);
        }

        var modal = $('[entry-modal="' + model.name + '"]');

        $.each(data, function (key, val) {
            modal.find('[' + model.name + '-' + key.replace('_', '-') + ']').html(
                (
                    val && typeof val !== 'object'
                        ? val
                        : (model.empty ? model.empty : '')
                )
            );
        });

        if (model.html) {
            model.html(modal, data);
        }

        if (model.fancybox) {
            $.fancybox.open(modal, {
                beforeClose: function () {
                    history.pushState(null, null, location.pathname);
                }
            });
        } else {
            modal.modal('show');
        }
    }

}