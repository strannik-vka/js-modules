class MultiRequest {

    constructor() {
        this.actions = {};
        this.isFirstFetch = false;
    }

    restart() {
        setTimeout(() => {
            this.request();
        }, 5000);
    }

    add(obj) {
        this.actions[obj.controller + '_' + obj.method] = obj;

        if (this.isFirstFetch == false) {
            this.isFirstFetch = true;
            this.request();
        }
    }

    request() {
        if (Object.keys(this.actions).length > 0) {
            let actions = Object.assign({}, this.actions),
                actionsKeys = Object.keys(actions);

            this.actions = {};

            $.post('/multirequest', {
                actions: actions
            }, response => {
                actionsKeys.forEach(key => {
                    if (typeof actions[key].callback === 'function') {
                        actions[key].callback(response.results[key]);
                    }
                })

                this.restart();
            }, 'json').fail(() => {
                actionsKeys.forEach(key => {
                    if (typeof actions[key].callback === 'function') {
                        actions[key].callback({ error: 'Ошибка соединения' });
                    }
                })

                this.restart();
            });
        } else {
            this.restart();
        }
    }

}

export default MultiRequest;