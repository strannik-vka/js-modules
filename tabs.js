class Tabs {

    constructor(tabSelector) {
        this.tabSelector = tabSelector;

        this.defaultShow();
        this.events();
    }

    events() {
        $(document).on('click', this.tabSelector, (e) => {
            this.show($(e.currentTarget));
        })
    }

    defaultShow() {
        if ($(this.tabSelector + '.active').length) {
            this.show($(this.tabSelector + '.active'));
        }
    }

    show(btn) {
        let id = btn.attr('data-tab-btn'),
            index = btn.index();

        $('[data-tab-btn="' + id + '"], [data-tab-content="' + id + '"]').removeClass('active');
        $('[data-tab-content="' + id + '"]:eq(' + index + ')').addClass('active');
        btn.addClass('active');
    }

}

new Tabs('[data-tab-btn]');

export default Tabs;