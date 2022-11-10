/*
    Атрибуты для html:
    data-toast       | Главный родитель
    data-toast-title | Заголовок
    data-toast-text  | Текст
    data-toast-btn   | Кнопка
    data-toast-close | Кнопка закрытия

    Создание:
    let MyToast = new Toast({
        type: 'info'         | Тип к примеру: success, error, info, warning, вставляется в class родителя
        template: '#myToast' | selector html template, если не указан, по-умолчанию [data-toast]
        title: 'Заголовок'
        text: 'Текст'
        btn: {
            text: 'Текст кнопки'
            close: true       | true - по-умолчанию закрытие по нажатию, false - нет
            onClick: () => {} | Функция по нажатию
        }
        close: {
            timeOut: 5000 | Миллисекунд до автозакрытия, false - не закрывается,
            btn: true     | Показывать кнопку закрытия
        }
        animate: {
            method: 'fadeOut' | Метод анимации
            duration: 500     | Длительность анимации
            easing: 'swing'   | Функция будет использована для анимации
        }
        onClickClose: false | true - Закрытие по клику на родитель
        onClick: () => {}   | Функция после клика на родитель
        onHidden: () => {}  | Функция после полного закрытия
        onShown: () => {}   | Функция после полного открытия
    })

    Методы:
    MyToast.show() | Показать
    MyToast.hide() | Скрыть
*/

class Toast {

    constructor(options) {
        this.setOptions(options);
        this.events();
    }

    events() {

    }

    setOptions(options) {
        this.options = options;
        this.options.type = options.type ? options.type : 'info';
        this.options.template = options.template ? options.template : '[data-toast]';
        this.options.outerHTML = $(this.options.template)[0].outerHTML;

        if (typeof this.options.btn === 'string') {
            this.options.btn = {
                text: this.options.btn,
                close: true
            }
        }

        if (typeof this.options.btn === 'object' && this.options.btn != null) {
            if (typeof this.options.btn.close === 'undefined') {
                this.options.btn.close = true;
            }
        }

        if (typeof this.options.close !== 'object' || this.options.close == null) {
            this.options.close = {
                timeOut: 5000,
                btn: true
            }
        }

        if (typeof this.options.animate !== 'object' || this.options.animate == null) {
            this.options.animate = {
                method: 'fadeOut',
                duration: 500,
                easing: 'swing'
            }
        }

        $(this.options.template).remove();
    }

    getTemplateHtml() {
        let html = $(this.options.outerHTML);

        if (this.options.type) {
            html.addClass(this.options.type);
        }

        if (this.options.title) {
            html.find('[data-toast-title]').html(this.options.title).show();
        }

        if (this.options.text) {
            html.find('[data-toast-text]').html(this.options.text).show();
        }

        if (this.options.btn && this.options.btn.text) {
            html.find('[data-toast-btn]').html(this.options.btn.text).show();
        }

        if (this.options.close && this.options.close.btn) {
            html.find('[data-toast-close]').show();
        }

        if (typeof this.options.onClick === 'function' || this.options.onClickClose) {
            html.addClass('onClick');
        }

        return html;
    }

    show() {
        $('body').append(this.getTemplateHtml());
    }

    hide() {
        $(this.options.template).remove();
    }

}

export default Toast;