/* eslint-env browser */
'use strict';

/* ======== Main ======== */

const folderURLPrefix = '/folder/show/';

// Group items when clicking the "Back" button
window.addEventListener('popstate', tryGroupItemsOnNextFrame);

// Group items after moving to a new folder
document.addEventListener('click', (e) => {
  if (e.target.matches(`a[href^="${folderURLPrefix}"], a[href^="${folderURLPrefix}"] *`)) {
    tryGroupItemsOnNextFrame();
  }
});

if (location.pathname.startsWith(folderURLPrefix)) {
  tryGroupItemsOnNextFrame();
}


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
  if (!location.pathname.startsWith(folderURLPrefix)) {
    return false; // Not in a folder that can have its items grouped
  }

  const folderTabs = document.querySelector('.folder-tabs');

  if (folderTabs === null) {
    return false;
  }

  if (folderTabs.firstElementChild.classList.contains('hp-tab-selected')) {
    return true; // The "Alphabetical" tab is selected, so group the items
  }

  return false;
}
