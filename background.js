import SavedText from "./shared/SavedText.js";

const MENU_PREFIX = "quick-text";

async function populateContextMenus() {
  // Remove existing menus
  chrome.contextMenus.removeAll();

  // Root menu
  chrome.contextMenus.create({
    id: `${MENU_PREFIX}-root`,
    title: "Quick Text",
    contexts: ["editable"],
  });

  const savedTexts = await SavedText.load();

  // Show placeholder if there are no saved texts
  if (savedTexts.length === 0) {
    chrome.contextMenus.create({
      id: `${MENU_PREFIX}-empty`,
      parentId: `${MENU_PREFIX}-root`,
      title: "No saved texts",
      contexts: ["editable"],
      enabled: false,
    });
    return;
  }

  // Create menu item per saved text
  savedTexts.reverse().forEach((t) => {
    chrome.contextMenus.create({
      id: `${MENU_PREFIX}-${t.id}`,
      parentId: `${MENU_PREFIX}-root`,
      title: t.text,
      contexts: ["editable"],
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  populateContextMenus();
});

chrome.runtime.onStartup.addListener(() => {
  populateContextMenus();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes[SavedText.STORAGE_KEY]) {
    populateContextMenus();
  }
});
