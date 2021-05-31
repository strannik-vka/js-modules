window.modalNotify = {

    init: function () {
        $(document).on('hidden.bs.modal', '#modalNotify', function () {
            $('body').removeClass('open-modal-notify');
            modalNotify.clear();
        });
    },

    close: function () {
        $('#modalNotify').modal('hide');
    },

    clear: function () {
        $('#modalNotify')
            .removeClass('info success error default')
            .find('[data-title], [data-text], [data-btn]').html('').hide();
    },

    create: function (obj) {
        modalNotify.clear();

        if (obj.title) {
            $('#modalNotify [data-title]').html(obj.title).show();
        }

        if (obj.text) {
            $('#modalNotify [data-text]').html(obj.text).show();
        }

        if (obj.btn) {
            $('#modalNotify [data-btn]').html(obj.btn).show();
        }

        if (obj.type) {
            $('#modalNotify').addClass(obj.type);
        }

        $('#modalNotify').modal('show');

        $('body').addClass('open-modal-notify');

        if (obj.onClickClose || obj.onClick) {
            $('#modalNotify [data-btn]').off('click').on('click', function () {
                if (obj.onClickClose) {
                    modalNotify.close();
                }

                if (obj.onClickPreloader) {
                    $(this).html(obj.onClickPreloader).off('click');
                }

                if (obj.onClick) {
                    obj.onClick();
                }
            });
        }
    }

}

$(modalNotify.init);