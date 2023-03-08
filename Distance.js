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
        this.contentPercentSub = Array.isArray(options.contentPercentSub) ? options.contentPercentSub : [];
        this.contentPercentSubHeight = this.getContentPercentSubHeight();

        this.isOff = false;

        this.scroll();

        window.addEventListener('resize', () => {
            this.getContentPercentSubHeight();
        }, false);
    }

    addContentPercentSubHeight(selectors) {
        this.contentPercentSub = selectors;
        this.getContentPercentSubHeight();
    }

    getContentPercentSubHeight() {
        let subHeight = 0;

        if (this.contentPercentSub.length > 0) {
            this.contentPercentSub.forEach(element => {
                subHeight += $(element).height();
            });
        }

        this.contentPercentSubHeight = subHeight;

        return subHeight;
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

    listenContentPercent(listenContentPercentCallback) {
        this.listenContentPercentCallback = listenContentPercentCallback;
    }

    viewportToPixels(value) {
        var parts = value.match(/([0-9\.]+)(vh|vw)/)
        var q = Number(parts[1])
        var side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]]
        return side * (q / 100)
    }

    scroll() {
        if (typeof this.scrollTopLast === 'undefined') {
            this.scrollTopLast = $(window).scrollTop();

            $(window)
                .on('scroll', () => {
                    if (this.isOff == false) {
                        let elemHeight = $(this.selector).css('height');

                        if (elemHeight.indexOf('vh') > -1) {
                            elemHeight = this.viewportToPixels(elemHeight);
                        }

                        let top = $(this.selector).offset().top - this.scrollTopLast,
                            bottom = top + parseFloat(elemHeight),
                            topPercent = 100 / ($(window).height() / top);

                        if (this.callback || this.listenCallback) {
                            let up = this.scrollTopLast > $(window).scrollTop(),
                                data = {
                                    top: top,
                                    topPercent: topPercent,
                                    bottom: bottom,
                                    bottomPercent: 100 / ($(window).height() / bottom),
                                    up: up,
                                    down: !up
                                }

                            if (this.callback) {
                                this.callback(data);
                            }

                            if (this.listenCallback) {
                                this.listenCallback(data);
                            }
                        }

                        if (this.listenContentPercentCallback) {
                            let contentPercent = 0;

                            let bottomAndWindow = bottom - $(window).height() - this.contentPercentSubHeight;

                            if (bottomAndWindow < 0) {
                                contentPercent = 100;
                            } else if (topPercent > 0) {
                                contentPercent = 0;
                            } else {
                                let bottomPercentDown = 100 / ($(window).height() / bottomAndWindow);

                                contentPercent = 100 / ((bottomPercentDown - topPercent) / Math.abs(topPercent));
                            }

                            this.listenContentPercentCallback(contentPercent);
                        }
                    }

                    this.scrollTopLast = $(window).scrollTop();
                });
        }
    }

}

export default Distance;