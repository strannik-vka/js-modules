/*
    selector - селектор item в котором находятся кнопка и контент
    data-cc-btn - атрибут для кнопки скрытия/расскрытия
*/

class CustomCollapse {

    constructor(selector, options) {
        this.selector = selector;

        this.itemActiveClass = options && options.itemActiveClass ? options.itemActiveClass : 'active';
        this.btnActiveClass = options && options.btnActiveClass ? options.btnActiveClass : 'active';
        this.animate = options && options.animate ? options.animate : false;

        this.events();
    }

    events() {
        let btns = document.querySelectorAll('[data-cc-btn]');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggle(btn);
            });
        });
    }

    toggle(btn) {
        let item = btn.closest(this.selector);

        if (item) {
            let isShow = item.classList.contains(this.itemActiveClass);

            if (isShow) {
                item.classList.remove(this.itemActiveClass);
                btn.classList.remove(this.btnActiveClass);
            } else {
                item.classList.add(this.itemActiveClass);
                btn.classList.add(this.btnActiveClass);
            }

            if (this.animate) {
                this.itemAnimate(item, isShow);
            }
        }
    }

    itemAnimate(item, isShow) {
        let height = null,
            sourceHeight = item.getAttribute('data-source-height');

        if (!sourceHeight) {
            sourceHeight = item.clientHeight;
            item.setAttribute('data-source-height', sourceHeight);
        }

        if (isShow) {
            height = sourceHeight;
        } else {
            item.style.height = 'auto';
            height = item.clientHeight;
            item.style.height = null;
        }

        $(item).animate({
            height: height + 'px'
        }, this.animate);
    }

}

export default CustomCollapse;