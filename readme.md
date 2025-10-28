# plp_bookstore - MongoDB Week 1 Assignment

## Setup
1. Create MongoDB Atlas cluster (free tier).
2. Add a DB user and allow your IP to access the cluster.
3. Obtain the connection string.

## Files
- `insert_books.js` - inserts 10 books into `plp_bookstore.books`.
- `queries.js` - contains all required MongoDB queries, aggregation pipelines and indexing operations.
- `README.md` - this file.

## Run scripts with mongosh
Replace <CONN> with your connection string including username and password:

```bash
mongosh "<CONN>" --file insert_books.js
mongosh "<CONN>" --file queries.js
