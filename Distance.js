class Distance {

    constructor(selector, callback) {
        this.selector = selector;
        this.callback = callback;

        this.isOff = false;

        this.scroll();
    }

    off() {
        this.isOff = true;
    }

    on() {
        this.isOff = false;
    }

    listen(listenCallback) {
        this.listenCallback = listenCallback;
    }

    scroll() {
        if (typeof this.scrollTopLast === 'undefined') {
            this.scrollTopLast = $(window).scrollTop();

            $(window)
                .on('scroll', () => {
                    if (this.isOff == false) {
                        var up = this.scrollTopLast > $(window).scrollTop(),
                            top = $(this.selector).offset().top - this.scrollTopLast,
                            data = {
                                top: top,
                                topPercent: 100 / ($(window).height() / top),
                                up: up,
                                down: !up
                            };

                        if (this.callback) {
                            this.callback(data);
                        }

                        if (this.listenCallback) {
                            this.listenCallback(data);
                        }
                    }

                    this.scrollTopLast = $(window).scrollTop();
                });
        }
    }

}

export default Distance;