/**
 * Insert text at the focused editable element
 *
 * @param {String} text - data object
 */
function insertText(text) {
  // TODO: Replace the deprecated execCommand method
  document.execCommand("insertText", false, text);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action && message.action === "insertText") {
    insertText(message.text);
  }
});
