type LocalStorageValue = string | number | boolean | object;
export const LocalStorageKey = {
  GroupSearch: 'GROUP_SEARCH_OPTIONS',
};
export const appLocalStorage = {
  setItem(key: string, value: LocalStorageValue) {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  },

  getItem<T extends LocalStorageValue>(key: string): T | null {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue) {
      return JSON.parse(serializedValue) as T;
    }
    return null;
  },

  removeItem(key: string) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },

  insertToList<T>(key: string, item: T) {
    const itemsJson = localStorage.getItem(key);
    const items: T[] = itemsJson ? JSON.parse(itemsJson) : [];
    const itemIndex = items.findIndex((i) => i === item);
    if (itemIndex === -1) items.push(item);
    else {
      items.splice(itemIndex, 1);
      items.push(item);
    }
    const reversedItems = items.reverse();
    localStorage.setItem(key, JSON.stringify(reversedItems));
    return reversedItems;
  },

  removeInList(key: string, item: any) {
    const items = this.getList(key);
    const updatedItems = items.filter((i: any) => i !== item);
    const reversedItems = updatedItems.reverse();

    localStorage.setItem(key, JSON.stringify(reversedItems));

    return reversedItems;
  },

  getList(key: string): any[] {
    const items = localStorage.getItem(key);
    return items ? JSON.parse(items) : [];
  },
};
