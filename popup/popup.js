let textInput, addButton, textList;
let textRowTemplate;

const savedTexts = [];

document.addEventListener("DOMContentLoaded", () => {
  textInput = document.getElementById("textInput");
  addButton = document.getElementById("addButton");
  textList = document.getElementById("textList");

  textRowTemplate = document.getElementById("text-row-template");

  populateTextList([]);
  addButton.addEventListener("click", () => {
    addText(textInput.value);
  });
});

/**
 * Populate the textList container with texts from savedTexts.
 */
function populateTextList() {
  // const savedTexts = await SavedText.load();
  textList.replaceChildren();

  savedTexts.forEach((t) => {
    // Copy template content
    const textRow = textRowTemplate.content.cloneNode(true);

    // Set id and text
    textRow.querySelector(".id").value = t.id;
    textRow.querySelector(".text").textContent = t.text;

    // Add event listener to the delete button
    textRow.querySelector(".delete-button").addEventListener("click", () => {
      removeText(t.id);
    });

    textList.appendChild(textRow);
  });
}

/**
 * Add new text to list and storage.
 *
 * @param {string} text
 */
async function addText(text) {
  // Don't do anything if text input is empty
  if (!text) {
    return;
  }

  // Empty text input
  textInput.value = "";

  // const savedTexts = await SavedText.load();
  savedTexts.push(new SavedText(text));
  populateTextList();
}

/**
 * Remove text from list and storage.
 *
 * @param {string} id
 */
async function removeText(id) {
  console.log(`remove: ${id}`);
  populateTextList();
}
