import SavedText from "../shared/SavedText.js";

let textInput, addButton, textList;
let textRowTemplate;

document.addEventListener("DOMContentLoaded", () => {
  nameInput = document.getElementById("nameInput");
  textInput = document.getElementById("textInput");
  addButton = document.getElementById("addButton");
  textList = document.getElementById("textList");

  textRowTemplate = document.getElementById("text-row-template");

  populateTextList();
  addButton.addEventListener("click", () => {
    addText(nameInput.value, textInput.value);
  });
});

/**
 * Populate the textList container with texts from savedTexts.
 */
async function populateTextList() {
  const savedTexts = await SavedText.load();
  textList.replaceChildren();

  savedTexts.forEach((t) => {
    // Copy template content
    const textRow = textRowTemplate.content.cloneNode(true);

    // Set id and text
    textRow.querySelector(".id").value = t.id;
    textRow.querySelector(".text").textContent = t.text;

    // Set name if not empty
    if (t.name) {
      textRow.querySelector(".name").textContent = `${t.name} `;
    }

    // Add event listener to the delete button
    textRow.querySelector(".delete-button").addEventListener("click", () => {
      removeText(t.id);
    });

    textList.prepend(textRow);
  });
}

/**
 * Add new text to list and storage.
 *
 * @param {string} name
 * @param {string} text
 */
async function addText(name, text) {
  // Don't do anything if text input is empty
  if (!text) {
    return;
  }

  // Empty input fields
  nameInput.value = "";
  textInput.value = "";

  // Create and save new saved text
  const savedText = new SavedText(name, text);
  await savedText.add();

  // Re-populate text list
  populateTextList();
}

/**
 * Remove text from list and storage.
 *
 * @param {string} id
 */
async function removeText(id) {
  // Get saved text by id
  const savedTexts = await SavedText.load();
  const savedText = savedTexts.find((t) => t.id === id);

  // Delete saved text
  await savedText.delete();

  // Re-populate text list
  populateTextList();
}
