import uniqid from "uniqid";

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {                                             // 1) Pass in an ID
        const index = this.items.findIndex(el => el.id === id);  // 2) Find the index of that ID in the items array
        this.items.splice(index, 1);                             // 3) Delete that item from the array using splice
    }

    updateCount(id, newCount){                                   // 1) Pass in an ID and a new count
        this.items.find(el => el.id === id).count = newCount;    // 2) Find the element that has the same ID and update its count
    }
}

// Note about splice and slice
// [2,4,8].splice(1, 2) ---> returns [4, 8], original array is [2]
// [2,4,8].slice(1, 2) ---> returns 4, original array is [2,4,8]