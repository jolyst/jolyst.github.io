import ToDoItem from './todoitem.js';
import ToDoList from './todolist.js';

const toDoList = new ToDoList();

document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initApp();
    }
});

const initApp = () => {
    // Add Listeners
    const itemEntryForm = document.getElementById("itemEntryForm");
    itemEntryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        processSubmission();
    })

    const clearItems = document.getElementById('clearItems');
    clearItems.addEventListener("click", (event) => {
        const list = toDoList.getList();
        if(list.length) {
            const confirmed = confirm("Are you sure?");
            if(confirmed) {
                toDoList.clearList();
                updatePersistentData(toDoList.getList());
                refreshThePage();
            }
        }
    });
    // Procedural
    // load list object from persistent data
    loadListObject();
    // refresh the page
    refreshThePage();
}
const loadListObject = () => {
    const storedList = localStorage.getItem("listContents");
    if(typeof storedList !== "string") return;
    const parsedList = JSON.parse(storedList);
    parsedList.forEach(itemObj => {
        const newToDoItem = createNewItem(itemObj._id, itemObj._item);
        toDoList.addItemToList(newToDoItem);
    })
}
const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
}

const clearListDisplay = () => {
    const parentElement = document.getElementById("listItems");
    deleteContents(parentElement);
}

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;

    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}

const renderList = () => {
    const list = toDoList.getList();
    list.forEach(item => {
        buildListItem(item);
    })
}

const buildListItem = (item) => {
    const divHolder = document.createElement("div");
    divHolder.className = "app-l-list-item";
    const div = document.createElement("div");
    div.className = "app-c-checkbox";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;

    addClickListenerToCheckbox(check);
    
    const label = document.createElement("label");
    label.htmlFor = item.getId();
    // label.textContent = item.getItem();

    const span = document.createElement("span");
    span.className = "app-c-checkbox-label"
    span.textContent = item.getItem();

    const icon = document.createElement("span");
    icon.className = "app-c-checkbox-icon"

    divHolder.appendChild(div);
    div.appendChild(label);
    label.appendChild(check);
    label.appendChild(icon);
    label.appendChild(span);

    const container = document.getElementById('listItems');
    container.appendChild(divHolder);
}

const addClickListenerToCheckbox = (checkbox) => {
    checkbox.addEventListener("click", (event) => {
        toDoList.removeItemFromList(checkbox.id);
        updatePersistentData(toDoList.getList());

        setTimeout(() => {
            refreshThePage();
        }, 1000);
    })
}

const updatePersistentData = (listArray) => {
    localStorage.setItem('listContents', JSON.stringify(listArray));
}

const clearItemEntryField = () => {
    document.getElementById("newItem").value = "";
}

const setFocusOnItemEntry = () => {
    document.getElementById("newItem").focus();
}

const processSubmission = () => {
    const newEntryText = getNewEntry();
    if(!newEntryText.length) return;
    const nextItemId = calcNextItemId();
    const toDoItem = createNewItem(nextItemId, newEntryText);
    toDoList.addItemToList(toDoItem);

    updatePersistentData(toDoList.getList());

    refreshThePage();
}

const getNewEntry = () => {
    return document.getElementById("newItem").value.trim("");
}

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = toDoList.getList();
    if(list.length > 0) {
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;
}

const createNewItem = (itemId, itemText) => {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);
    return toDo;
}