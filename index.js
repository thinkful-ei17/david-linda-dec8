'use strict';

const STORE = {
  items: [
  {name: 'apples', checked: false},
  {name: 'oranges', checked: false},
  {name: 'milk', checked: true},
  {name: 'bread', checked: false}
  ],
  hideCompleted: false
}

//User can press a toggle switch to show all items or show only items that are unchecked
/*
  need to edit html to include input type - checkbox; when click > only show items unchecked; button is Hide Completed items
  when unclicked > show all itmes


  false = not marked completed items

  1. listen for event

*/

function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}

// hideComplete false = do not hide checked true items; show all
// hidecomplete true = hide checked true items
// if hidecomplete is true then create new array of items not checked (check is false);

function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  let shoppingListItemsString;
  let uncheckedList = STORE.items;
  if (STORE.hideCompleted) {
    uncheckedList = uncheckedList.filter(function(status){
      return status.checked === false; //can have multiple filters
    }); //just return true or false
  }
  shoppingListItemsString = generateShoppingItemsString(uncheckedList);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItem(itemIndex) {
//   STORE[itemIndex].remove();
  STORE.items.splice(itemIndex,1);
  console.log('`deleteListItem` ran');
}


function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
  
}

function handleCompletedFilterToggle() {
  $('#js-filter-toggle').click(() => {
    console.log('handleCompletedFilterToggle ran');
    STORE.hideCompleted = !STORE.hideCompleted;
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleCompletedFilterToggle();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);