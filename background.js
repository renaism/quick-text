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
      title: (t.name ? `${t.name}: ` : "") + t.text,
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

// Handle context menus clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Ignore invalid menu id or tab
  if (!info.menuItemId || typeof info.menuItemId !== "string") return;
  if (!info.menuItemId.startsWith(MENU_PREFIX)) return;
  if (!tab || !tab.id) return;

  // Ignore empty placeholder
  if (info.menuItemId === `${MENU_PREFIX}-empty`) return;

  // Get saved text id from menu id
  const id = info.menuItemId.slice(MENU_PREFIX.length + 1);
  if (id === "") return;

  // Get the saved text value
  const savedTexts = await SavedText.load();
  const savedText = savedTexts.find((t) => t.id === id);
  if (!savedText) return;

  // Send message to the active tab
  chrome.tabs.sendMessage(tab.id, {
    action: "insertText",
    text: savedText.text,
  });
});
