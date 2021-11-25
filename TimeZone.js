class TimeZone {

    constructor() {
        try {
            this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            this.setTimezone();
        } catch (err) { }
    }

    setTimezone() {
        var timezone = this.getCookie('user_timezone');
        if (timezone == '') {
            timezone = this.getCookie('current_timezone');
            if (timezone == '' || timezone !== this.timezone) {
                this.setCookie('current_timezone', this.timezone, 30);
                window.timezoneUpdate = this.timezone;
            }
        }
    }

    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

}