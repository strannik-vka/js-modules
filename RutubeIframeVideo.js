class RutubeIframeVideo {

    constructor(options) {
        options = typeof options === 'object' && options != null ? options : {};

        this.sendUrl = options.sendUrl;
        this.sendData = typeof options.sendData === 'object' && options.sendData != null
            ? options.sendData : {};
        this.sendInterval = options.sendInterval ? options.sendInterval : 5000;

        this.duration = options.duration ? options.duration : 0;
        this.viewedSegments = typeof options.viewedSegments === 'object' && options.viewedSegments != null ? options.viewedSegments : [];
        this.isPlay = false;

        this.iframeListen();
        this.interval();
    }

    interval() {
        setInterval(() => {
            if (this.isPlay) {
                this.dataSend();
            }
        }, this.sendInterval);
    }

    dataSend() {
        let data = this.sendData;

        data.duration = this.duration;
        data.viewedSegments = this.viewedSegments;

        $.post(this.sendUrl, data);
    }

    addCurrentTime(time) {
        let prevSegment = false,
            nextSegment = false,
            isMerge = false,
            inSegment = false;

        for (let i = 0; i < this.viewedSegments.length; i++) {
            let segment = this.viewedSegments[i];

            if (time < segment[0]) {
                nextSegment = {
                    index: i,
                    times: segment
                }
                break;
            } else if (time == segment[0]) {
                inSegment = true;
                break;
            }

            if (segment.length == 2) {
                if (segment[0] <= time && time <= segment[1]) {
                    inSegment = true;
                    break;
                }
            }

            prevSegment = {
                index: i,
                times: segment
            }
        }

        if (inSegment == false) {
            let prevTimeForComparison = false;

            if (prevSegment !== false) {
                prevTimeForComparison = prevSegment.times.length == 2
                    ? prevSegment.times[1] : prevSegment.times[0];

                if (time - prevTimeForComparison < 1) {
                    prevTimeForComparison = time;

                    this.viewedSegments[prevSegment.index] = [
                        prevSegment.times[0],
                        time
                    ];

                    isMerge = true;
                }
            }

            if (nextSegment !== false) {
                if (prevTimeForComparison !== false) {
                    if (nextSegment.times[0] - prevTimeForComparison < 1) {
                        this.viewedSegments[prevSegment.index] = [
                            prevSegment.times[0],
                            nextSegment.times.length == 2 ? nextSegment.times[1] : nextSegment.times[0]
                        ];

                        this.viewedSegments.splice(nextSegment.index, 1);

                        isMerge = true;
                    }
                } else {
                    if (nextSegment.times[0] - time < 1) {
                        this.viewedSegments[nextSegment.index] = [
                            time,
                            nextSegment.times.length == 2 ? nextSegment.times[1] : nextSegment.times[0]
                        ];

                        isMerge = true;
                    }
                }
            }

            if (isMerge == false) {
                if (prevSegment !== false) {
                    this.viewedSegments.splice(prevSegment.index + 1, 0, [time]);
                } else if (nextSegment !== false) {
                    this.viewedSegments.splice(nextSegment.index, 0, [time]);
                } else {
                    this.viewedSegments.push([time]);
                }
            }
        }
    }

    iframeListen = () => {
        window.addEventListener('message', event => {
            try {
                var message = JSON.parse(event.data);

                if (message.type == 'player:durationChange' && !this.duration) {
                    this.duration = message.data.duration;
                }

                if (this.duration) {
                    if (message.type == 'player:currentTime') {
                        this.addCurrentTime(message.data.time);
                    }
                }

                if (message.type == 'player:changeState') {
                    if (message.data.state == 'playing') {
                        this.isPlay = true;
                    } else if (['paused', 'stopped'].indexOf(message.data.state) > -1) {
                        this.isPlay = false;
                        this.dataSend();
                    }
                }
            } catch { }
        });
    }

}

export default RutubeIframeVideo;