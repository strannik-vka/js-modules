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
                url: '/debug',
                data: {
                    text: text
                },
                queue: true
            });
        }, time);
    }

    onerror() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            this.send(navigator.userAgent + '\nurl: ' + url + '\nmsg: ' + msg + '\nlineNo: ' + lineNo + '\ncolumnNo: ' + columnNo + '\nerror: ' + (error.stack ? error.stack : error) + '\npage: ' + location.href + '\nuer: ' + (typeof user === 'object' && user != null ? JSON.stringify(user) : null));
        }
    }

}

export default new Debug();