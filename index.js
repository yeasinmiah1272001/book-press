const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = 5000;
console.log(process.env.DB_USER);
const cookieParser = require("cookie-parser");
const cors = require("cors");

// midleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wx5w5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const bookCollection = client.db("BookPress").collection("books");

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // auth releted appi

    app.get("/", async (req, res) => {
      res.send("book-press running");
    });

    app.get("/books", async (req, res) => {
      const cursor = bookCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: { title: 1, price: 1, description: 1, img: 1 },
      };
      const result = await bookCollection.findOne(query, options);
      res.send(result);
    });

    app.post("/books", async (req, res) => {
      const newBook = req.body;
      console.log(newBook);
      const result = await bookCollection.insertOne(newBook);
      res.send(result);
    });

    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(query);
      res.send(result);
    });

    app.listen(port, () => {
      console.log(`Simple Crud is Running on port ${port}`);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);
