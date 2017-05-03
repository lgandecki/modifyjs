import modify from './modify.js';

describe("modify", function() {
    it("sets a new field", () => {
        const myObject = {existingItem: "here"};

        const newField = Object.freeze({newField: "here as well"});
        const updatedObject = modify(myObject, {$set: newField});

        const expectedObject = {...myObject, newField};
        expect(updatedObject).toEqual(expectedObject);
    })
})