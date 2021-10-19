class Notify {

    send(text) {
        ajax({
            method: 'post',
            url: '/notify',
            data: {
                text: text
            },
            queue: true
        });
    }

}

export default new Notify();