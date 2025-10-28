// queries.js
// Run with: mongosh "<CONNECTION_STRING>" --file queries.js
db = db.getSiblingDB("plp_bookstore");

// ---------- Basic CRUD examples ----------

// Find all books in a specific genre (example: "Technology")
print("\nBooks in genre 'Technology':");
db.books.find({ genre: "Technology" }).pretty();

// Find books published after a certain year (example: after 2015)
print("\nBooks published after 2015:");
db.books.find({ published_year: { $gt: 2015 } }).pretty();

// Find books by a specific author (example: "Ada K. Rivers")
print("\nBooks by Ada K. Rivers:");
db.books.find({ author: "Ada K. Rivers" }).pretty();

// Update the price of a specific book (example: update "The Silent Library" price)
print("\nUpdating price for 'The Silent Library'...");
db.books.updateOne(
  { title: "The Silent Library" },
  { $set: { price: 13.99 } }
);
printjson(db.books.findOne({ title: "The Silent Library" }));

// Delete a book by its title (example: delete "Cooking Lagos")
// Uncomment to run deletion
// db.books.deleteOne({ title: "Cooking Lagos" });

// ---------- Advanced Queries ----------

// 1) Find books that are both in stock and published after 2010
print("\nBooks in stock and published after 2010:");
db.books.find({ in_stock: true, published_year: { $gt: 2010 } }).pretty();

// 2) Use projection to return only title, author, price fields
print("\nProjection (title, author, price) for all books:");
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).pretty();

// 3) Sorting by price ascending
print("\nBooks sorted by price ASC:");
db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: 1 }).pretty();

// Sorting by price descending
print("\nBooks sorted by price DESC:");
db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: -1 }).pretty();

// 4) Pagination: 5 books per page (example: page 1 and page 2)
const pageSize = 5;
print("\nPage 1 (first 5):");
db.books.find().skip(0).limit(pageSize).pretty();

print("\nPage 2 (next 5):");
db.books.find().skip(pageSize).limit(pageSize).pretty();

// ---------- Aggregation Pipelines ----------

// Average price of books by genre
print("\nAverage price by genre:");
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" }, count: { $sum: 1 } } },
  { $project: { genre: "$_id", avgPrice: 1, count: 1, _id: 0 } },
  { $sort: { avgPrice: -1 } }
]).pretty();

// Author with the most books in the collection
print("\nAuthor with most books:");
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 },
  { $project: { author: "$_id", count: 1, _id: 0 } }
]).pretty();

// Group books by publication decade and count them
print("\nBooks grouped by decade:");
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $concat: [
          { $toString: { $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ] } },
          "s"
        ]
      }
    }
  },
  { $group: { _id: "$decade", count: { $sum: 1 } } },
  { $project: { decade: "$_id", count: 1, _id: 0 } },
  { $sort: { decade: 1 } }
]).pretty();

// ---------- Indexing and explain() ----------

// Create index on title (if not created by insert script)
print("\nCreating index on title (if not exists):");
db.books.createIndex({ title: 1 });

// Create compound index on author and published_year
print("\nCreating compound index on author and published_year:");
db.books.createIndex({ author: 1, published_year: -1 });

// Use explain() to show query plan before and after (example query: find a title)
// First, run an unindexed query (simulate by dropping indexes) - CAUTION: DO NOT drop all indexes on production
// For demonstration we'll show explain on the title query
print("\nExplain for find({ title: 'The Silent Library' }) :");
printjson(db.books.find({ title: "The Silent Library" }).explain("executionStats"));

// Explain for a compound author + year query
print("\nExplain for find({ author: 'Jamie Lee', published_year: { $gt: 2015 } }) :");
printjson(db.books.find({ author: "Jamie Lee", published_year: { $gt: 2015 } }).explain("executionStats"));
