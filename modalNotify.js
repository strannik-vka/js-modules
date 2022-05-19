window.modalNotify = {

    modal: false,

    init: function () {
        $(document).on('hidden.bs.modal', '#modalNotify', function () {
            $('body').removeClass('open-modal-notify');
            modalNotify.clear();

            if (modalNotify.modal) {
                modalNotify.modal = false;
                $('body').addClass('modal-open').css('padding-right', '8px');
            }
        });

        $('body').append('<style>#modalNotify {z-index: 2050;} .open-modal-notify .modal-backdrop:last-child {z-index: 2000;} </style>');
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

        if (obj.btnClose) {
            $('#modalNotify [data-btn-close]').show();
        }

        if ($('body').attr('class')) {
            if ($('body').attr('class').indexOf('modal') > -1) {
                modalNotify.modal = true;
            }
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

        if (obj.btnRedirect) {
            $('#modalNotify [data-btn]').off('click').on('click', function () {
                location.href = obj.btnRedirect;
            });
        }
    }

}

$(modalNotify.init);