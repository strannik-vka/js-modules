class Counter {

    constructor(selector, start) {
        this.selector = selector;

        this.init();

        if (start) {
            this.start();
        }
    }

    init() {
        $(this.selector).css('opacity', 0);
    }

    start() {
        $(this.selector).each((i, item) => {
            $(item).prop('Counter', 0)
                .css('opacity', '1')
                .animate({
                    Counter: $(item).text()
                }, {
                    duration: 3500,
                    easing: 'swing',
                    step: (now) => {
                        $(item).text(this.commaSeparateNumber(Math.ceil(now)));
                    }
                });
        });
    }

    commaSeparateNumber(val) {
        while (/(\d+)(\d{3})/.test(val.toString())) {
            val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ' ' + '$2');
        }
        return val;
    }

}

export default Counter;