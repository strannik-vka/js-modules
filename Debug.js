class Debug {

    constructor() {
        this.timer = false;
        this.clicks = [];
        this.events();
        this.onerror();
    }

    events() {
        document.addEventListener('click', (event) => {
            if (event) {
                let targetName = null,
                    attrs = [];

                if (event.target) {
                    targetName = event.target.tagName;

                    if (event.target.attributes) {
                        for (let i = 0; i < event.target.attributes.length; i++) {
                            let attr = event.target.attributes[i];

                            if (attr.nodeName && attr.nodeValue) {
                                attrs.push(attr.nodeName + '=' + attr.nodeValue);
                            }
                        }
                    }
                }

                this.clicks.push({
                    positions: this.getPosition(event),
                    targetName: targetName,
                    attrs: attrs
                });

                if (this.clicks.length > 10) {
                    this.clicks.shift();
                }
            }
        });
    }

    send(text) {
        var time = 0;

        if (this.timer) {
            time = 2000;
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(function () {
            ajax({
                method: 'post',
                url: 'https://domain-checker.ru/api/debug/store',
                data: {
                    message: text
                },
                queue: true
            });
        }, time);
    }

    onerror() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            if (lineNo && columnNo) {
                var text = '';

                text += navigator.userAgent + "\n";
                text += 'url: ' + url + "\n";
                text += 'msg: ' + msg + "\n";
                text += 'lineNo: ' + lineNo + "\n";
                text += 'columnNo: ' + columnNo + "\n";
                text += 'page: ' + location.href + "\n";

                if (typeof error === 'object' && error != null) {
                    text += 'error: ' + JSON.stringify(error.stack ? error.stack : error) + "\n";
                }

                if (typeof user === 'object' && user != null) {
                    text += 'user: ' + JSON.stringify(user) + "\n";
                }

                text += 'clientWidth: ' + this.getClientWidth() + "\n";
                text += 'scrollTop: ' + this.getScrollTop() + "\n";
                text += 'clicks: ' + JSON.stringify(this.clicks) + "\n";

                this.send(text);
            }
        }
    }

    getScrollTop() {
        if (typeof window.pageYOffset != 'undefined') {
            return window.pageYOffset;
        }

        let doc = document.documentElement;

        doc = doc.clientHeight ? doc : document.body;

        return doc.scrollTop;
    }

    getClientWidth() {
        return window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
    }

    getPosition(e) {
        let x = 0,
            y = 0;

        if (!e) {
            let e = window.event;
        }

        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else if (e.clientX || e.clientY) {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return { x: x, y: y }
    }

}

export default new Debug();