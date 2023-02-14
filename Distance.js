/*
    contentPercent - На сколько процентов просмотрен блок
        вверхняя граница блока касается вверхней границы окна = 0% 
        нижняя граница блока касается нижней границы окна = 100% 
*/

class Distance {

    constructor(selector, callback, options) {
        options = options ?? {};

        this.selector = selector;
        this.callback = callback;
        this.contentPercent = options.contentPercent;

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
                            bottom = top + parseFloat($(this.selector).css('height')),
                            data = {
                                top: top,
                                topPercent: 100 / ($(window).height() / top),
                                bottom: bottom,
                                bottomPercent: 100 / ($(window).height() / bottom),
                                up: up,
                                down: !up
                            };

                        if (this.contentPercent) {
                            let bottomAndWindow = bottom - $(window).height();

                            if (bottomAndWindow < 0) {
                                data.contentPercent = 100;
                            } else if (data.topPercent > 0) {
                                data.contentPercent = 0;
                            } else {
                                let bottomPercentDown = 100 / ($(window).height() / bottomAndWindow);

                                data.contentPercent = 100 / ((bottomPercentDown - data.topPercent) / Math.abs(data.topPercent));
                            }
                        }

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