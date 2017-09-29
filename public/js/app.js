// @author: Vinod Singh Ramalwan
// @date: Sa 2. Sep 16:02:49 CEST 2017
// @description: To create a to-do app as per details given in README.md file

var incompleteTaskList = document.getElementById('incomplete-tasks');
var completedTaskList = document.getElementById('completed-tasks');
const url = 'http://localhost:3000/api/tasks';
var listItems = []; //Global array to keep track of all to-do items across various operations (add, edit, delete)

// Get the existing to-do tasks
function getUpdatedToDoList() {
    list = [];  //Local array to get latest items and push data to application controls
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        let toDoList = data;
        for (var key in toDoList) {
            if (toDoList.hasOwnProperty(key)) {
                console.log(key + " -> " + toDoList[key].text);
                list.push(toDoList[key].text);
                
                // Store the items in global array
                let eachItem = {"id": key, "text": toDoList[key].text};
                listItems.push(eachItem);
            }
        }
        document.getElementById("incomplete-tasks").innerHTML = ""; //Refresh to-do item list; Optimal solution: update only the new item keeping the old list intact ;)
        document.getElementById("completed-tasks").innerHTML = ""; //Refresh completed item list; Optimal solution: update only the new item keeping the old list intact ;)
        // localStorage.clear();
        return list.map(function(item) {
            if (localStorage.getItem(item) === null) {  // ****QUALIFICATION stage!
                addItemToIncompleteTaskList(item);    
            }
            else {
                addItemToCompletedTaskList(item);
            }
        })
    })
    .catch(function(error) {
        console.log(JSON.stringify(error));
    });
}

function addItemToIncompleteTaskList(value) {
    let list = createList('li'),
        inputType = createCheckbox('input'),
        label = createLabel(value),
        textbox = createTextBox(),
        buttonEdit = createButton('edit'),
        buttonDelete = createButton('delete');
    append(list, inputType);
    append(list, label);
    append(list, textbox);
    append(list, buttonEdit);
    append(list, buttonDelete);
    append(incompleteTaskList, list);
    
    buttonEdit.onclick = editItem;
    buttonDelete.onclick = deleteItem;
    inputType.onclick = taskMarking;
    if (localStorage.getItem(value) != null) {
        localStorage.removeItem(value);
    }
}

function updateListItems(payload) {
    listItems.push(payload);
}
function addItemToCompletedTaskList(value) {
    let list = createList('li'),
        inputType = createCheckbox('input'),
        label = createLabel(value),
        textbox = createTextBox(),
        buttonDelete = createButton('delete');
    append(list, inputType);
    append(list, label);
    append(list, textbox);
    append(list, buttonDelete);
    append(completedTaskList, list);
    
    buttonDelete.onclick = deleteItem;
    inputType.onclick = taskMarking;
    localStorage.setItem(value, 1); //Add completed items on localstorage for appropriate mapping in ****QUALIFICATION stage!
    console.log(localStorage);
}

// Adding event listener for the enter key-press while creating new task
document.getElementById('new-task').addEventListener("keyup", function(event) {
    if (event.keyCode == '13') {
        addItemToList();
    }
})

// Add new task to the to-do list
function addItemToList() {
    var newTask = document.getElementById('new-task').value;
    var idGenerator = Math.floor(Math.random() * 10000000000) + 10 ;
    var payload = {
        id: idGenerator.toString(), // Include a check to avoid duplicate ids
        text: newTask
    }
    
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {"content-type": "application/json"}
    })
    .then(function(res){   
        if (res.ok) { // ok if status is 2xx
            console.log('OK ' + res.statusText);
            // getUpdatedToDoList();
            addItemToIncompleteTaskList(newTask);
            updateListItems(payload);
            document.getElementById("new-task").value = ""; // Clear value from text-box once add operation successful
        } else {
            console.log('Request failed.  Returned status of ' + res.status);
        }
        return res.blob()
    })
    .then(function(blob){ console.log(blob.type); })
    .catch(function(error) {
        console.log(JSON.stringify(error));
    });
}

// Edit an existing task in to-do list
function editItem() {
    var listItem = this.parentNode;
    var editInput = listItem.querySelector("input[type=text]")
    var label = listItem.querySelector("label");
    let operation = listItem.querySelector("button[class=edit]").textContent;
    var initialValue = '';
    if (operation == 'Edit') {
        listItem.querySelector("button[class=edit]").textContent = "Save"
        // var containsClass = listItem.classList.contains("editMode");
        initialValue = label.textContent  // store the initial text of item
        editInput.value = label.innerText;
    }
    
    else if (operation == 'Save') {
        listItem.querySelector("button[class=edit]").textContent = "Edit"
        var modifiedValue = editInput.value;
        //Start with the PUT operation here
        for (var i = 0; i < listItems.length; i++){
            
            let originalValue = label.innerText;
            if (listItems[i].text == originalValue) {
                var payload = {
                    id: listItems[i].id,
                    text: modifiedValue
                }
                // modify url to append current item key
                let editUrl = url+ '/' +listItems[i].id;
                fetch(editUrl, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                    headers: {"content-type": "application/json"}
                })
                .then(function(res){
                    if (res.ok) { // ok if status is 2xx
                        console.log('OK ' + res.statusText);
                        getUpdatedToDoList();
                        listItems[i].text = modifiedValue;
                        document.getElementById("new-task").value = ""; // Clear value from text-box once add operation successful
                    } else {
                        console.log('Request failed.  Returned status of ' + res.status);
                    }
                    return res.blob();
                })
                .then(function(blob){ console.log(blob.type); })
                .catch(function(error) {
                    console.log(JSON.stringify(error));
                });
            }
        }
    }
    // Modify the editing status here
    //if the class of the parent is .editMode
    var containsClass = listItem.classList.contains("editMode");
    if(containsClass) {
        //switch from .editMode 
        //Make label text become the input's value
        label.innerText = editInput.value;
    } else {
        //Switch to .editMode
        //input value becomes the label's text
        editInput.value = label.innerText;
    }
    
    // Toggle .editMode on the parent
    listItem.classList.toggle("editMode");
    
}

// Delete an item from task-list
function deleteItem() {
    var currentItem = this.parentNode;
    var ul = currentItem.parentNode;
    
    //Remove the parent list item from the ul
    ul.removeChild(currentItem);
    
    //Use DELETE to remove the item from backend too
    for (var i = 0; i < listItems.length; i++){
        let selectedItem = currentItem.querySelector("label").innerText;
        if (listItems[i].text == selectedItem) {
            // modify url to append current item's key
            let deleteUrl = url+ '/' +listItems[i].id;
            fetch(deleteUrl, {
                method: 'DELETE',
            })
            .then(function(res) {
                if (res.ok) { // ok if status is 2xx
                    console.log('OK ' + res.statusText);
                    if (localStorage.getItem(selectedItem) != null) {
                        localStorage.removeItem(selectedItem);
                        listItems.splice(i, 1); // Update the list item with modified value
                    }
                    getUpdatedToDoList();
                    document.getElementById("new-task").value = ""; // Clear value from text-box once add operation successful
                } else {
                    console.log('Request failed.  Returned status of ' + res.status);
                }
                return res.blob();
            })
            .then(function(blob){ console.log(blob.type); })
            .catch(function(error) {
                console.log(JSON.stringify(error));
            });
        }
    }
}
// Mark a task as complete or todo
function taskMarking() {
    var listItem = this.parentNode;
    var value = listItem.querySelector("label").innerText;
    console.log(incompleteTaskList.contains(listItem));
    if (incompleteTaskList.contains(listItem)) {
        remove(incompleteTaskList, listItem);   //Remove from todo list
        addItemToCompletedTaskList(value);      //Add to completed list
    }
    else {
        remove(completedTaskList, listItem);   //Remove from completed list
        addItemToIncompleteTaskList(value); //Append to todo list
    }
}

function createList() {
    return document.createElement('li');
}

function createCheckbox(element) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    return checkbox;
}

function createLabel(value) {
    var label = document.createElement('label');
    label.innerHTML = value;
    return label;
}

function createTextBox() {
    var textbox = document.createElement('input');
    textbox.type = "text";
    return textbox;
}

function createButton(type) {
    var button = document.createElement('button');
    button.className = type;
    if (type == 'edit') {
        button.innerText = "Edit";
    }
    else {
        button.innerText = "Delete";
    }
    return button;
}

function append(parent, el) {
    return parent.appendChild(el);
}

function remove(parent, el) {
    return parent.removeChild(el);
}