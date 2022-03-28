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

        var ua = navigator.userAgent.toLowerCase();
        this.isSafari = ua.indexOf('safari') > -1 && ua.indexOf('chrome') == -1;

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
            let isShow = $(item).hasClass(this.itemActiveClass);

            if (isShow) {
                $(item).removeClass(this.itemActiveClass);
                $(btn).removeClass(this.btnActiveClass);
            } else {
                $(item).addClass(this.itemActiveClass);
                $(btn).addClass(this.btnActiveClass);
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
            sourceHeight = parseFloat($(item).css('height'));
            item.setAttribute('data-source-height', sourceHeight);
        }

        if (isShow) {
            height = sourceHeight;
            this.elemAnimate(item, height);
        } else {
            $(item).addClass('open');
            $(item).css('height', 'auto');
            alert(this.isSafari);
            if (this.isSafari) {
                setTimeout(() => {
                    height = parseFloat($(item).css('height'));
                    $(item).removeAttr('style');
                    this.elemAnimate(item, height);
                }, 100);
            } else {
                height = parseFloat($(item).css('height'));
                $(item).removeAttr('style');
                this.elemAnimate(item, height);
            }
        }
    }

    elemAnimate(item, height) {
        $(item).animate({
            height: height + 'px'
        }, this.animate);
    }

}

export default CustomCollapse;