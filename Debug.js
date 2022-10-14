class Debug {

    constructor() {
        this.timer = false;
        this.onerror();
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

                this.send(text);
            }
        }
    }

    getScrollTop() {
        if (typeof window.pageYOffset != 'undefined') {
            return window.pageYOffset;
        }
        else {
            var B = document.body;
            var D = document.documentElement;
            D = (D.clientHeight) ? D : B;
            return D.scrollTop;
        }
    }

    getClientWidth() {
        return window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
    }

}

export default new Debug();