let hrefs = document.querySelectorAll('[data-href]');

if (hrefs) {
    hrefs.forEach(element => {
        element.addEventListener('click', () => {
            location.href = element.getAttribute('data-href');
        });
    });
}