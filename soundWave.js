var soundWave = {

    context: false,
    width: 400,
    height: 40,

    url: function (url, callback) {
        if (soundWave.context === false) {
            soundWave.setContext();
        }

        if (soundWave.context) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                soundWave.context.decodeAudioData(this.response,
                    function (buffer) {
                        callback(soundWave.wave(
                            soundWave.channels(buffer, 1),
                            soundWave.width,
                            soundWave.height
                        ));
                    }, function () {
                        callback(false);
                    }
                );
            };
            xhr.send();
        }
    },

    setContext: () => {
        if (soundWave.context === false) {
            soundWave.AudioContext = window.AudioContext // Default
                || window.webkitAudioContext // Safari and old versions of Chrome
                || false;

            if (soundWave.AudioContext) {
                soundWave.context = new soundWave.AudioContext();
            }
        }
    },

    file: function (file, callback) {
        if (soundWave.context === false) {
            soundWave.setContext();
        }

        if (soundWave.context) {
            var reader = new FileReader();
            reader.onload = function (e) {
                soundWave.context.decodeAudioData(e.target.result,
                    function (buffer) {
                        callback(soundWave.wave(
                            soundWave.channels(buffer, 1),
                            soundWave.width,
                            soundWave.height
                        ));
                    }, function () {
                        callback(false);
                    }
                );
            }
            reader.readAsArrayBuffer(file);
        }
    },

    wave: function (channel, elemWidth, elemHeight) {
        var allMin = 0, allMax = 0;

        for (var i = 0; i < channel.length; i++) {
            allMin = channel[i] < allMin ? channel[i] : allMin;
            allMax = channel[i] > allMax ? channel[i] : allMax;
        }

        var result = [];

        for (var i = 0; i < elemWidth; i++) {
            var min = 0, max = 0;
            let sampleFrom = Math.floor(channel.length * i / elemWidth);
            let sampleTo = Math.floor(channel.length * (i + 1) / elemWidth);
            var rms = 0;

            // считаем минимум и максимум на участке + среднее квадратичное
            for (var j = sampleFrom; j < sampleTo; j++) {
                min = channel[j] < min ? channel[j] : min;
                max = channel[j] > max ? channel[j] : max;
                rms += channel[j] * channel[j] / (sampleTo - sampleFrom);
            }

            var top = Math.floor(elemHeight * (allMax - min) / (allMax - allMin)),
                toY = Math.floor(elemHeight * (allMax - max) / (allMax - allMin)),
                height = (toY - top);

            result.push([top, height]);
        }

        return result;
    },

    channels: function (buffer, index) {
        if (index) {
            return buffer.getChannelData(index == -1 ? (buffer.numberOfChannels - 1) : index);
        }

        var result = [];

        for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
            result.push(buffer.getChannelData(channel));
        }

        return result.length ? result : false;
    }

}

export default soundWave;