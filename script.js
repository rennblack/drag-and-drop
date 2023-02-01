const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the app', 'Relax'];
    progressListArray = ['Work on function', 'Listen to music'];
    completeListArray = ['Meditate', 'Fix  API'];
    onHoldListArray = ['Go for a run'];
  }
}



// Set localStorage Arrays
function updateSavedColumns() {
listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray]
const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
arrayNames.forEach((arrayName, index) => {
  localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
});  
}

// Filter Arrays to remove empty items
function filterArray(array) {
    const filteredArray = array.filter(item => item !== null);
    return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {  
  // List Item
  const listEl = document.createElement('li');
  listEl.textContent = item;
  listEl.id = index;
  listEl.classList.add('drag-item');
  listEl.draggable = true;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  listEl.setAttribute('ondragstart', 'drag(event)');
  // Add another function which takes care of the click
  listEl.setAttribute('onclick', 'editable(event)');  
  // Append
  columnEl.appendChild(listEl);
}

// additional function to handle click and make it also work in firefox
function editable(el) {
  // set the clicked list element as editable
  el.target.contentEditable = true;
  // set the focus on this element in order to be able to change the text
  // and to keep the drag functionality working
  el.target.focus();
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
    if (!dragging) {
      if (!selectedColumnEl[id].textContent) {
        delete selectedArray[id];
        } else {
          selectedArray[id] = selectedColumnEl[id].textContent;
        }
        updateDOM();
    }
  }

// Add to Column List. Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allows Arrays to reflect Drag and Drop items
function rebuildArrays() {
  
  backlogListArray = Array.from(backlogListEl.children).map(i => i.textContent);  
  progressListArray = Array.from(progressListEl.children).map(i => i.textContent);
  completeListArray = Array.from(completeListEl.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldListEl.children).map(i => i.textContent);
  updateDOM();
}

// When Item Starts Dragging
function drag(e) {
draggedItem = e.target;
dragging = true;
}

// Column Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// When Item Enters Column Area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  // Remove Background Color Padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // Add Item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArrays();
}

// On Load
updateDOM();