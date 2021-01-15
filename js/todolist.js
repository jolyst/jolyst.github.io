
export default class ToDoList {
    _list = [];

    constructor() {
        this._list = [];
    }

    getList() {
        return this._list;
    }

    clearList() {
        this._list = [];
    }

    addItemToList(itemObj) {
        this._list.push(itemObj);
    }

    removeItemFromList(id) {
        const list = this._list;
        for (let i = 0; i < this._list.length; i++) {
            if (list[i]._id == id) {
                list.splice(i, 1);
                break;
            }
        }
    }
}