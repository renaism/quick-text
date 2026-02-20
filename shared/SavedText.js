class SavedText {
  static STORAGE_KEY = "savedTexts";

  /**
   * @param {string} id
   * @param {string} text
   */
  constructor(text, id = null) {
    this.id = id || this.generateId();
    this.text = text;
  }

  /**
   * Generate unique ID.
   *
   * @returns {string} generated ID
   */
  generateId() {
    return `${Date.now().toString(36)}_${Math.random().toString(36).slice(-6)}`;
  }

  /**
   * Convert instance to plain object.
   *
   * @returns {object} plain object
   */
  toJSON() {
    return {
      id: this.id,
      text: this.text,
    };
  }

  /**
   * Add the instance to the storage.
   */
  async add() {
    // Append the instance to the current saved texts from storage
    const savedTexts = await SavedText.load();
    savedTexts.push(this);

    // Save change to the storage
    SavedText.#save(savedTexts);
  }

  /**
   * Delete the instance from the storage.
   */
  async delete() {
    // Filter out the current saved texts by this instance id
    let savedTexts = await SavedText.load();
    savedTexts = savedTexts.filter((t) => t.id !== this.id);

    // Save change to the storage
    SavedText.#save(savedTexts);
  }

  /**
   * Create instance from plain object.
   *
   * @param {Object} object - data object
   * @returns {SavedText} class instance
   */
  static fromJSON(obj) {
    return new SavedText(obj.text, obj.id);
  }

  /**
   * Retrieve saved texts from storage.
   *
   * @returns {Promise<SavedText[]>} list of saved texts
   */
  static async load() {
    const data = await chrome.storage.sync.get([this.STORAGE_KEY]);
    const savedTextsData = data[this.STORAGE_KEY];

    // Return empty array if savedTexts is not set or not an array
    if (!savedTextsData || !Array.isArray(savedTextsData)) {
      return [];
    }

    // Parse each object to an instance of SavedText class
    // Only include objects that have valid properties
    return savedTextsData.reduce((arr, obj) => {
      if (obj.id && obj.text) {
        arr.push(SavedText.fromJSON(obj));
      }
      return arr;
    }, []);
  }

  /**
   * Save texts to storage.
   *
   * @param {SavedText[]} savedTexts - array of SavedText instances
   */
  static async #save(savedTexts) {
    await chrome.storage.sync.set({
      [this.STORAGE_KEY]: savedTexts.map((t) => t.toJSON()),
    });
  }
}

export default SavedText;
