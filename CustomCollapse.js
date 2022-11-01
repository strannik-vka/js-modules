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
            this.isShow = $(item).hasClass(this.itemActiveClass);

            if (this.isShow) {
                $(item).removeClass(this.itemActiveClass);
                $(btn).removeClass(this.btnActiveClass);
            } else {
                $(item).addClass(this.itemActiveClass);
                $(btn).addClass(this.btnActiveClass);
            }

            if (this.animate) {
                this.itemAnimate(item);
            }
        }
    }

    itemAnimate(item) {
        let height = null,
            sourceHeight = item.getAttribute('data-source-height');

        if (!sourceHeight) {
            sourceHeight = parseFloat($(item).css('height'));
            item.setAttribute('data-source-height', sourceHeight);
        }

        if (this.isShow) {
            $(item).addClass('closing');

            height = sourceHeight;
            this.elemAnimate(item, height, () => {
                $(item).removeClass('closing');
            });
        } else {
            $(item).css('height', 'auto');

            if (this.isSafari) {
                setTimeout(() => {
                    height = parseFloat($(item).css('height'));
                    $(item).removeAttr('style');
                    $(item).addClass('open');
                    this.elemAnimate(item, height);
                }, 100);
            } else {
                height = parseFloat($(item).css('height'));
                $(item).removeAttr('style');
                $(item).addClass('open');
                this.elemAnimate(item, height);
            }
        }
    }

    elemAnimate(item, height, callback) {
        $(item).animate({
            height: height + 'px'
        }, this.animate, callback);
    }

}

export default CustomCollapse;