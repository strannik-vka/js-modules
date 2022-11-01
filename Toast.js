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
        animate: {
            method: 'fadeOut' | Метод анимации
            duration: 500     | Длительность анимации
            easing: 'swing'   | Функция будет использована для анимации
        }
        btn: {
            text: 'Текст кнопки'
            close: true       | true - по-умолчанию закрытие по нажатию, false - нет
            onClick: () => {} | Функция по нажатию
        }
        close: {
            timeOut: 1000 | Миллисекунд до автозакрытия, false - не закрывается,
            btn: true     | Показывать кнопку закрытия
            onClick: true | Закрытие по клику на родитель
        }
        onClick: () => {}  | Функция после клика на родитель
        onHidden: () => {} | Функция после полного закрытия
        onShown: () => {}  | Функция после полного открытия
    })

    Методы:
    MyToast.show() | Показать
    MyToast.hide() | Скрыть
*/

class Toast {

    constructor(options) {
        this.options = options;
    }

    template() {

    }

    show() {

    }

    hide() {

    }

}

export default Toast;