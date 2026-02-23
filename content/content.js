/**
 * Insert text at the focused element
 *
 * @param {String} text
 */
function insertText(text) {
  const element = document.activeElement;

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    // Handle Input and TextArea element
    insertTextHTMLInputElement(element, text);
  } else if (element instanceof HTMLElement && element.isContentEditable) {
    // Handle ContentEditable element
    insertTextContentEditable(element, text);
  }
}

/**
 * Insert text at an HTML input element (input, textarea)
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} element
 * @param {String} text
 */
function insertTextHTMLInputElement(element, text) {
  const { selectionStart, selectionEnd } = element;

  if (typeof element.setRangeText === "function") {
    element.setRangeText(text);
    element.selectionStart = selectionStart + text.length;
    element.selectionEnd = element.selectionStart;
  } else {
    // Fallback for older browsers
    element.value =
      element.value.slice(0, selectionStart) +
      text +
      element.value.slice(selectionEnd);
    element.selectionStart = element.selectionEnd =
      selectionStart + text.length;
  }

  element.dispatchEvent(new InputEvent("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

/**
 * Insert text at a ContentEditable element
 *
 * @param {HTMLElement} element
 * @param {String} text
 */
function insertTextContentEditable(element, text) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(text));
  range.collapse(false);

  selection.removeAllRanges();
  selection.addRange(range);

  element.dispatchEvent(new InputEvent("input", { bubbles: true }));
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action && message.action === "insertText") {
    insertText(message.text);
  }
});
