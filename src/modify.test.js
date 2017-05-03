import update from 'immutability-helper';
import modify from './modify.js';


// Examples are taken from https://docs.mongodb.com/manual/reference/
describe("modify", function () {
  // it("$currentDate", () => {
  //   const myObject = {existingItem: "here"};
  //
  //   const updatedObject = modify(myObject, {$currentDate: "lastModified"});
  //   expect(updatedObject).toEqual()
  // })
  describe("$min", () => {
    it("updates a field when the passed value is lower than an existing one", () => {
      const myObject = { _id: 1, highScore: 800, lowScore: 200 };

      const updatedObject = modify(myObject, {$min: {lowScore: 150}});

      const expectedObject = {...myObject, lowScore: 150}
      expect(updatedObject).toEqual(expectedObject);
    })
    it("doesn't update a field when the passed value is higher than an existing one", () => {
      const myObject = { _id: 1, highScore: 800, lowScore: 200 };

      const updatedObject = modify(myObject, {$min: {lowScore: 250}});

      const expectedObject = {...myObject}
      expect(updatedObject).toEqual(expectedObject);
    })
  })
  describe("$max", () => {
    it("updates a field when the passed value is higher than an existing one", () => {
      const myObject = {_id: 1, highScore: 800, lowScore: 200}

      const updatedObject = modify(myObject, {$max: {highScore: 950}});

      const expectedObject = {...myObject, highScore: 950};
      expect(updatedObject).toEqual(expectedObject);
    })
    it("doesn't update a field when the passed value is lower than an existing one", () => {
      const myObject = { _id: 1, highScore: 950, lowScore: 200 };

      const updatedObject = modify(myObject, {$max: {highScore: 870}});

      const expectedObject = {...myObject};
      expect(updatedObject).toEqual(expectedObject);
    })
  });
  describe("$inc", () => {
    it("can increment with positive and negative values at the same time", () => {
      const myObject = {
        _id: 1,
        sku: "abc123",
        quantity: 10,
        metrics: {
          orders: 2,
          ratings: 3.5
        }
      };

      const updatedObject = modify(myObject, {$inc: {quantity: -2, "metrics.orders": 1}});

      const expectedObject = update(myObject, {
        quantity: {$set: myObject.quantity - 2},
        metrics: {
          orders: {$set: myObject.metrics.orders + 1}
        }
      });

      expect(updatedObject).toEqual(expectedObject);
    })
  });
  describe("$set", () => {
    // https://docs.mongodb.com/manual/reference/operator/update/set/#set-top-level-fields
    it("sets top-level fields", () => {
      const myObject = {
        _id: 100,
        sku: "abc123",
        quantity: 250,
        instock: true,
        reorder: false,
        details: { model: "14Q2", make: "xyz" },
        tags: [ "apparel", "clothing" ],
        ratings: [ { by: "ijk", rating: 4 } ]
      };

      const updatedObject = modify(myObject, { $set:
        {
          quantity: 500,
          details: { model: "14Q3", make: "xyz" },
          tags: [ "coats", "outerwear", "clothing" ]
        }
      });

      const expectedObject = update(myObject, {
        quantity: {$set: 500},
        details: {$set: {model: "14Q3", make: "xyz"}},
        tags: {$set: [ "coats", "outerwear", "clothing" ]}
      });

      expect(updatedObject).toEqual(expectedObject);
    })
    // https://docs.mongodb.com/manual/reference/operator/update/set/#set-fields-in-embedded-documents
    it("sets fields in embedded documents", () => {
      const myObject = {
        _id: 100,
        sku: "abc123",
        quantity: 250,
        instock: true,
        reorder: false,
        details: { model: "14Q2", make: "xyz" },
        tags: [ "apparel", "clothing" ],
        ratings: [ { by: "ijk", rating: 4 } ]
      };

      const updatedObject = modify(myObject, {$set: { "details.make": "zzz"}});

      const expectedObject = update(myObject, {
        details: {
          make: {$set: "zzz"}
        }
      })

      expect(updatedObject).toEqual(expectedObject);
    })
    // https://docs.mongodb.com/manual/reference/operator/update/set/#set-elements-in-arrays
    it("sets elements in arrays", () => {
      const myObject = {
        _id: 100,
        sku: "abc123",
        quantity: 250,
        instock: true,
        reorder: false,
        details: { model: "14Q2", make: "xyz" },
        tags: [ "apparel", "clothing" ],
        ratings: [ { by: "ijk", rating: 4 } ]
      };

      const updatedObject = modify(myObject, { $set:
        {
          "tags.1": "rain gear",
          "ratings.0.rating": 2
        }
      });

      const expectedObject = update(myObject, {
        tags: {
          1: {$set: "rain gear"}
        },
        ratings: {
          0: {
            rating: {$set: 2}
          }
        }
      });

      expect(updatedObject).toEqual(expectedObject);
    })
  })
  it("$unset")
  it("$push")
  it("$pushAll")
  it("$addToSet")
  it("$pop")
  it("$pull")
  it("$pullAll")
  it("$rename")
})