/* eslint-env browser */
'use strict';

/* ======== Main ======== */

window.addEventListener('popstate', tryGroupItemsOnNextFrame);

tryGroupItemsOnNextFrame();


/* ====== Functions ====== */

function tryGroupItemsOnNextFrame() {
  window.requestAnimationFrame(tryGroupItems);
}

function tryGroupItems() {
  const itemsContainer = document.querySelector('.hp-doc-and-folder-list');

  if (itemsContainer === null) {
    tryGroupItemsOnNextFrame();
    return;
  }

  // Register a listener on folder links to group the items after moving to the new folder
  const links = document.querySelectorAll('a[href^="/folder/show/"]');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', tryGroupItemsOnNextFrame);
  }

  groupFolderItems(itemsContainer);
}

function groupFolderItems(itemsContainer) {
  if (!shouldGroupFolderItems()) {
    return;
  }

  const folders = document.createDocumentFragment();
  const docs = document.createDocumentFragment();

  for (;;) {
    const item = itemsContainer.firstElementChild;

    if (item === null) {
      break;
    }

    if (item.classList.contains('hp-list-item-folder')) {
      folders.appendChild(item);
    } else {
      docs.appendChild(item);
    }
  }

  itemsContainer.appendChild(folders);
  itemsContainer.appendChild(docs);
}

function shouldGroupFolderItems() {
  const folderTabs = document.querySelector('.folder-tabs');

  if (folderTabs === null) {
    return false;
  }

  if (folderTabs.firstElementChild.classList.contains('hp-tab-selected')) {
    return true; // The "Alphabetical" tab is selected, so group the items
  }

  return false;
}
