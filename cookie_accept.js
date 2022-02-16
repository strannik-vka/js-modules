let cookie_accepts = document.querySelectorAll('[data-cookie-accept]');

if (cookie_accepts) {
    cookie_accepts.forEach(btn => {
        btn.addEventListener('click', () => {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + 30);
            document.cookie = "cookie_accept=1;path=/;expires=" + exdate.toGMTString();
        });
    });
}