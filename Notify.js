class Notify {

    send(text) {
        ajax({
            method: 'post',
            url: '/notify',
            data: {
                text: navigator.userAgent + "\n" + text
            },
            queue: true
        });
    }

}

export default new Notify();