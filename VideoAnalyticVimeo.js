/*
    new VideoAnalyticVimeo({
        selector: 'video', - селектор html видео
        sendUrl: '/lesson-analytic' - куда отправлять  аналитику,
        sendData: {} - какие данные отправлять вместе
        sendInterval: 5 - отправка через каждые 5 сек
    });
*/

class VideoAnalyticVimeo {

    constructor(obj) {
        this.init(obj);
        this.initCount = 0;
    }

    init(obj) {
        this.iframe = document.querySelector(obj.selector);

        if (this.iframe) {
            this.video = new Vimeo.Player(iframe);
            this.src = this.getSrc();
            this.sendData = typeof obj.sendData === 'object' && obj.sendData != null ? obj.sendData : {};
            this.sendUrl = obj.sendUrl;
            this.sendInterval = obj.sendInterval ? obj.sendInterval : 5;

            this.duration = null;
            this.timeUpdateInterval = null;
            this.sendCount = 0;

            this.video.on('pause', this.pause, false);
            this.video.on('ended', this.ended, false);
            this.video.on('play', this.play, false);
        } else {
            if (this.initCount < 5) {
                this.initCount++;

                setTimeout(() => {
                    this.init(obj);
                }, 1000);
            }
        }
    }

    getSrc() {
        let src = this.iframe.getAttribute('src');

        if (!src) {
            src = this.iframe.getAttribute('data-src');
        }

        return src;
    }

    ended = () => {
        this.send(true);
        this.timeUpdateStop();
    }

    pause = () => {
        this.send(true);
        clearInterval(this.timeUpdateInterval);
    }

    play = () => {
        if (!this.duration) {
            this.video.getDuration().then(function (duration) {
                this.duration = duration;
            }).catch(function (error) {
                // an error occurred
            });
        }

        this.timeUpdate(() => {
            this.send();

            if (this.getPercentView() >= 100) {
                this.timeUpdateStop();
            }
        });
    }

    getPercentView() {
        let viewTime = this.getViewTime();

        if (viewTime && this.duration) {
            let percent = Math.ceil(viewTime * 100 / this.duration);

            if (percent > 100) {
                percent = 100;
            }

            return percent;
        }

        return 0;
    }

    timeUpdateStop() {
        clearInterval(this.timeUpdateInterval);
        sessionStorage.removeItem(this.src);
    }

    getViewTime() {
        let viewTime = parseInt(sessionStorage.getItem(this.src));

        viewTime = viewTime ? viewTime : 0;

        return viewTime;
    }

    timeUpdate(callback) {
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
        }

        this.timeUpdateInterval = setInterval(() => {
            let viewTime = this.getViewTime();

            viewTime++;

            sessionStorage.setItem(this.src, viewTime);

            if (callback) callback(viewTime);
        }, 1000);
    }

    send(force) {
        if (this.sendCount >= this.sendInterval || force) {
            this.sendCount = 0;

            let data = this.sendData;

            data.percent_view = this.getPercentView();

            $.post(this.sendUrl, data);
        } else {
            this.sendCount++;
        }
    }

}

export default VideoAnalyticVimeo;