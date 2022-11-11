const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mkpcxwu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client
      .db("aradunVisaConsultancy")
      .collection("services");
    const reviews = client.db("aradunVisaConsultancy").collection("reviews");
    const addService = client
      .db("aradunVisaConsultancy")
      .collection("addService");

    app.get("/limit-services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req.params);
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviews.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await reviews.findOne(query);
      res.send(service);
    });

    app.get("/addService", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = addService.find(query);
      const storedServices = await cursor.toArray();
      res.send(storedServices);
    });

    app.post("/reviews", async (req, res) => {
      const order = req.body;
      const result = await reviews.insertOne(order);
      res.send(result);
    });

    app.post("/addService", async (req, res) => {
      const order = req.body;
      const result = await addService.insertOne(order);
      res.send(result);
    });

    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const reviewInfo = req.body;
      const option = { upsert: true };
      const updatedReviewInfo = {
        $set: {
          service: reviewInfo.service,
          serviceName: reviewInfo.serviceName,
          price: reviewInfo.price,
          customer: reviewInfo.customer,
          email: reviewInfo.email,
          reviewText: reviewInfo.reviewText,
        },
      };
      const result = await reviews.updateOne(filter, updatedReviewInfo, option);
      res.send(result);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviews.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("The server is running");
});

app.listen(port, () => {
  console.log(`The server is running on ${port}`);
});
