/* 
    1. Счетчик табов new BsTab({id: id}).countersEventInit();
    2. Переключение стрелками new BsTab({id: id}).buttonsEventInit();
*/

class BsTab {

    constructor(obj) {
        this.id = obj.id;
        this.process = false;
    }

    countersEventInit() {
        var tablist = document.getElementById(this.id),
            tabElems = tablist.querySelectorAll('[data-bs-toggle="tab"]');

        tabElems.forEach((tabElem) => {
            tabElem.addEventListener('shown.bs.tab', (event) => {
                this.setCurrent(event.target);
                this.process = false;
            });
        });

        this.setTotal(tablist);
    }

    buttonsEventInit() {
        var nextElems = document.querySelectorAll('[data-tab-next="' + this.id + '"]');

        nextElems.forEach((nextElem) => {
            nextElem.addEventListener('click', (event) => {
                if (this.process == false) {
                    var getNextTab = this.getNextTab(event.target.getAttribute('data-tab-next'));
                    if (getNextTab) {
                        this.process = true;
                        new bootstrap.Tab(getNextTab).show();
                    }
                }
            });
        });

        var prevElems = document.querySelectorAll('[data-tab-prev="' + this.id + '"]');

        prevElems.forEach((prevElem) => {
            prevElem.addEventListener('click', (event) => {
                if (this.process == false) {
                    var getPrevTab = this.getPrevTab(event.target.getAttribute('data-tab-prev'));
                    if (getPrevTab) {
                        this.process = true;
                        new bootstrap.Tab(getPrevTab).show();
                    }
                }
            });
        });
    }

    getDataId(id) {
        var data = {
            tablist: document.getElementById(id)
        }

        data.activeTab = data.tablist.querySelector('.active');
        data.tabs = data.tablist.querySelectorAll('[data-bs-toggle="tab"]');
        data.activeTabIndex = Array.prototype.indexOf.call(data.tabs, data.activeTab);

        return data;
    }

    getPrevTab(id) {
        var data = this.getDataId(id),
            nextTabIndex = data.activeTabIndex - 1;

        return typeof data.tabs[nextTabIndex] !== 'undefined' ? data.tabs[nextTabIndex] : null;
    }

    getNextTab(id) {
        var data = this.getDataId(id),
            nextTabIndex = data.activeTabIndex + 1;

        return typeof data.tabs[nextTabIndex] !== 'undefined' ? data.tabs[nextTabIndex] : null;
    }

    setTotals() {
        var tablistElems = document.querySelectorAll('[role="tablist"]');

        tablistElems.forEach((tablistElem) => {
            this.setTotal(tablistElem);
        });
    }

    setTotal(tablistElem) {
        var total = tablistElem.querySelectorAll('[data-bs-toggle]').length,
            id = tablistElem.getAttribute('id');

        document.querySelectorAll('[data-tab-count-total="' + id + '"]').forEach((totalElem) => {
            totalElem.innerHTML = total;
        });
    }

    setCurrent(tabElem) {
        var id = tabElem.parentElement.getAttribute('id'),
            current = this.getIndex(tabElem) + 1;

        document.querySelectorAll('[data-tab-count-current="' + id + '"]').forEach((currentElem) => {
            currentElem.innerHTML = current;
        });
    }

    getIndex(tabElem) {
        return Array.prototype.indexOf.call(tabElem.parentElement.querySelectorAll('[data-bs-toggle]'), tabElem);
    }

}

export default BsTab;