window.audio = {

    elem: new Audio(),

    data: {},

    urls: [],

    add: function (url, data) {
        if (audio.urls.indexOf(url) == -1) {
            audio.urls.push(url);
        }

        if (data) {
            audio.data[url] = data;
        }
    },

    init: function () {
        window.audio = audio;

        audio.volume();
        audio.wave();

        audio.elem.addEventListener('ended', audio.next);
        audio.elem.addEventListener('timeupdate', audio.progress.update);

        $(document).on('mouseenter', '[audio-item]', audio.sliders);

        var mouseleaveTime = false;
        $(document).on('mouseenter', '.volume-btn', function () {
            if (mouseleaveTime) {
                clearTimeout(mouseleaveTime);
            }
            $(this).find('.volume-wrap').show();
        });
        $(document).on('mouseleave', '.volume-btn', function () {
            mouseleaveTime = setTimeout(function () {
                $('.volume-wrap').hide();
            }, 3000);
        });

        $(document).on('click', '[audio-play]', function () {
            if ($(this).attr('audio-active')) {
                $('[audio-active]').removeAttr('audio-active');
                audio.pause();
            } else {
                $('[audio-active]').removeAttr('audio-active');
                $(this).attr('audio-active', 'true');
                $(this).parents('[audio-item]').attr('audio-active', 'true');
                audio.play($(this).attr('audio-play'));
            }
        });
    },

    wave: function () {
        $('[audio-item]:not([wave-init])').each(function () {
            var wave_elem = $(this).find('[audio-wave]'),
                wave_width = parseInt($(this).find('[audio-progress]').css('width')),
                wave_count = parseInt(wave_width / 4),
                wave_step = parseInt(400 / wave_count);

            if (wave_width) {
                if (wave_elem.length) {
                    var url = $(this).find('[audio-play]:eq(0)').attr('audio-play'),
                        wave = audio.data[url] ? audio.data[url].wave : false;
                    wave = wave ? JSON.parse(wave) : false;

                    if (typeof wave === 'object') {
                        var count = 0;
                        $.each(wave, function (i, item) {
                            if (count == wave_step) {
                                count = 0;
                            }
                            if (count == 0) {
                                wave_elem.append('<div style="height:' + -(parseInt(item[1])) + 'px"></div>');
                            }
                            count++;
                        });
                    }
                }

                $(this).attr('wave-init', true);
            }
        });
    },

    src: function () {
        return audio.elem.src ? new URL(audio.elem.src).pathname : false;
    },

    play: function (url) {
        if (audio.src() != url) {
            audio.elem.src = url;
            audio.elem.currentTime = 0;
        }

        audio.elem.play();
        audio.sliders();
    },

    sliders: function () {
        if ($.fn.slider) {
            if ($('[audio-volume]:not([slider-init])').length) {
                $('[audio-volume]:not([slider-init])').attr('slider-init', true).slider({
                    slide: function (event, ui) {
                        audio.volume(ui.value / 100);
                    }
                });
            }

            if ($('[audio-progress]:not([slider-init])').length) {
                $('[audio-progress]:not([slider-init])').attr('slider-init', true).slider({
                    start: function () {
                        $(this).addClass('active');
                    },
                    stop: function () {
                        $(this).removeClass('active');
                    },
                    slide: function (event, ui) {
                        if (audio.elem.currentTime) {
                            audio.elem.currentTime = audio.elem.duration * (ui.value / 100);
                            audio.progress.update();
                        }
                    }
                });
            }
        }
    },

    pause: function () {
        audio.elem.pause();
    },

    next: function () {
        if (audio.urls.length) {
            var index = audio.urls.indexOf(audio.src()) + 1;
            if (index > audio.urls.length - 1) {
                index = 0;
            }

            if ($('[audio-play="' + audio.urls[index] + '"]')[0].tagName == 'A') {
                $('[audio-play="' + audio.urls[index] + '"]')[0].click();
            } else {
                $('[audio-play="' + audio.urls[index] + '"]').click();
            }
        }
    },

    prev: function () {
        if (audio.urls.length) {
            var index = audio.urls.indexOf(audio.src()) - 1;
            if (index < 0) {
                index = audio.urls.length - 1;
            }

            audio.play(audio.urls[index]);
        }
    },

    volume: function (percent) {
        if (percent) {
            var date = new Date();
            date.setMonth(date.getMonth() + 3);
            document.cookie = "volume=" + percent + "; path=/; expires=Tue, " + (date.toGMTString());
            audio.elem.volume = percent;
        } else {
            var volume_cookie = document.cookie.match('(^|;) ?volume=([^;]*)(;|$)');
            if (volume_cookie) {
                audio.elem.volume = volume_cookie[2];
            } else {
                audio.elem.volume = 1;
            }
        }

        $('[audio-line]').css('width', (audio.elem.volume * 100) + '%');
    },

    progress: {
        update: function () {
            $('[audio-play="' + audio.src() + '"]').each(function () {
                $(this).parents('[audio-item]').find('[progress-load]').css('width', audio.progress.load() + '%');
                $(this).parents('[audio-item]').find('[progress-time]').css('width', audio.progress.time() + '%');
                $(this).parents('[audio-item]').find('[time-current]').html(audio.time.current());
                $(this).parents('[audio-item]').find('[time-full]').html(audio.time.full());
            });
        },
        time: function () {
            return ((((audio.elem.currentTime || 0) / audio.elem.duration) * 100) || 0);
        },
        load: function () {
            var ranges = [], result = 0;

            for (var i = 0; i < audio.elem.buffered.length; i++) {
                ranges.push([
                    audio.elem.buffered.start(i),
                    audio.elem.buffered.end(i)
                ]);
            }

            for (var i = 0; i < audio.elem.buffered.length; i++) {
                result = Math.round(
                    (100 / audio.elem.duration) * (ranges[i][1] - ranges[i][0])
                );
            }

            return result;
        }
    },

    time: {
        format: function (audio_time) {
            var minutes = Math.floor(audio_time / 60) || 0,
                seconds = (audio_time - minutes * 60) || 0;
            return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        },
        full: function () {
            return audio.time.format(Math.round(audio.elem.duration))
        },
        current: function () {
            return audio.time.format(Math.round(audio.elem.currentTime));
        }
    }

}

audio.init();