const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 4001;

// middleware

app.use(cors());
app.use(express.json());

// mongodb

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfwsklw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const userCollection = client.db("gadgetShop").collection("users")
const productCollection = client.db("gadgetShop").collection("products")



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


app.post("/users", async(req,res)=>{
  const user = req.body;
  const query = {email:user.email}
  const existUser = await userCollection.findOne(query)
  if(existUser){
    return res.send({message:"user already exist"})
  }
  const result = await userCollection.insertOne(user)
  res.send(result)
})









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// api

app.get("/", (req, res) => {
  res.send("server is running");
});

// jwt
app.post("/authentication", async (req, res) => {
  const userEmail = req.body;
  const token = jwt.sign(userEmail, process.env.ACCESS_KEY_TOKEN, {
    expiresIn: "30d",
  });
  res.send({ token });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});