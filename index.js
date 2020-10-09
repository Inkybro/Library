var myLibrary = [];
const inputField = document.querySelector(".input-wrapper");
const titleField = document.querySelector("#title");
const authorField = document.querySelector("#author");
const pagesField = document.querySelector("#pages");
const readField = document.querySelector("#read");
const listContainer = document.querySelector("#list");

window.onload = function() {
    loadFromLocal();
    if (myLibrary) {
        generateLibrary();
    } else {
        myLibrary = [];
    }
}

function newBook(title, author, pages, read, time) {
    this.title = title;
    this.author = author;
    this.pages = parseInt(pages);
    this.read = read;
    this.time = time;
}

//new book
const newEntry = document.querySelector("#new-book");
newEntry.onclick = function showInput() {
    inputField.style.visibility = "visible";
}

//save to local storage
var myStorage = window.localStorage;
const storeLib = document.querySelector('#save');
storeLib.onclick = function storeLibrary() {
    myStorage.setItem("library", JSON.stringify(myLibrary));
}

function loadFromLocal() {
    myLibrary = JSON.parse(myStorage.getItem("library"));
}

//submit button
const submitEntry = document.querySelector("#submit");
submitEntry.onclick = function addBookToLibrary() {
    let date = new Date();
    let time = date.getTime();

    if (titleField.value && authorField.value && pagesField.value) {
        myLibrary.push(new newBook(titleField.value, authorField.value, pagesField.value, readField.checked, time));
    } else {
        console.log("Error: You must complete the required fields!");
    }

    generateLibrary();
}

//Generate HTML from Library Array
function generateLibrary() {
    let count = 0;
    listContainer.innerHTML = ``;

    let haveRead = `<div class = "read"> You have read this book </div>`;
    let haveNotRead = `<div class = "read"> You have not read this book </div>`
    let buttonsHTML = `<div class = "buttons">
                    <button class = "read-toggle"> Toggle Read Status </button>
                    <button class = "remove"> Remove </button>
                    </div>`;

    for (let i = 0; i < myLibrary.length; i++) {
        const listItem = document.createElement("li");
        let node = `
            <div class = "title"> ${myLibrary[i].title} </div>
            <div class = "author"> ${myLibrary[i].author} </div>
            <div class = "pages"> ${myLibrary[i].pages} </div>`;

        if (myLibrary[i].read) {
            node += haveRead + buttonsHTML;
        } else {
            node += haveNotRead + buttonsHTML;
        }

        listItem.innerHTML = node;
        listContainer.appendChild(listItem);
        listItem.className = `${count}`;
        count++;
    }

    //empty index, remove parent li, filter undefined entries, re-generate library
    let removeButtons = document.querySelectorAll('.remove');
    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].onclick = function() {
            myLibrary[this.parentNode.parentNode.className] = undefined;
            this.parentNode.parentNode.removeChild(this.parentNode);
            myLibrary = myLibrary.filter(book => {
                return book != null && book != '';
            });
            generateLibrary();
        }
    }

    //Toggle read status of selected entry
    let readToggleButtons = document.querySelectorAll('.read-toggle');
    for (let i = 0; i < readToggleButtons.length; i++) {
        readToggleButtons[i].onclick = function() {
            if (myLibrary[this.parentNode.parentNode.className].read) {
                myLibrary[this.parentNode.parentNode.className].read = false;
            } else {
                myLibrary[this.parentNode.parentNode.className].read = true;
            }
            generateLibrary();
        }
    }
}

//Filter by Title, Author, Pages, Read Status
let filters = document.querySelectorAll('.filter');
filters.forEach(element => element.addEventListener('click', Filter));
let filterTarget;

function Filter(e) {
    //Apply filter arrow changes to one column at a time
    let eventTargetChildren = Array.from(e.currentTarget.children[0].children);
    if (!filterTarget) {
        filterTarget = eventTargetChildren;
    } else if (filterTarget !== eventTargetChildren) {
        filterTarget.forEach(element => element.style.display = "initial");
        filterTarget = eventTargetChildren;
    }

    //filter lowest to highest if data-key is 0, else then highest to lowest 
    let dataset = e.currentTarget.dataset;
    let type = dataset.type;
    if (dataset.key == 0) {
        myLibrary.sort((a, b) => {
            var fa;
            var fb;
            var dataType = typeof a[type];

            if (dataType === "number" || dataType === "boolean") {
                fa = a[type];
                fb = b[type];
            } else {
                fa = a[type].toLowerCase();
                fb = b[type].toLowerCase();
            }


            if (fa < fb) {
                return -1;
            } else if (fa > fb) {
                return 1;
            } else {
                return 0;
            }
        });
        dataset.key = 1;
        eventTargetChildren[0].style.display = "none";
        eventTargetChildren[1].style.display = "initial";


    } else if (dataset.key == 1) {
        myLibrary.sort((a, b) => {
            var fa;
            var fb;
            var dataType = typeof a[type];

            if (dataType === "number" || dataType === "boolean") {
                fa = a[type];
                fb = b[type];
            } else {
                fa = a[type].toLowerCase();
                fb = b[type].toLowerCase();
            }

            if (fa < fb) {
                return 1;
            } else if (fa > fb) {
                return -1;
            } else {
                return 0;
            }
        });
        dataset.key = 0;
        eventTargetChildren[0].style.display = "initial";
        eventTargetChildren[1].style.display = "none";
    }
    generateLibrary();
}