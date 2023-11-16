const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvnw110.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

   const userCollection = client.db("restauDB").collection("users")
   const menuCollection = client.db("restauDB").collection("menu")
   const reviewsCollection = client.db("restauDB").collection("reviews")
   const cartsCollection = client.db("restauDB").collection("carts")

  //  users related api 
  app.post('/users', async(req, res) => {
    const user = req.body;
    const query = {email : user?.email};
    console.log(query);
    const existingUser = await userCollection.findOne(query);
    if(existingUser){
      return res.send({message: 'user already exists', insertedId: null})
    }
    const result = await userCollection.insertOne(user)
    res.send(result)
  })
  // users related api 
  app.get('/users', async(req, res) =>{
    const result = await userCollection.find().toArray()
    res.send(result)
  })
  app.delete('/users/:id', async(req,res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await userCollection.deleteOne(query);
    res.send(result)
  })

  app.patch('/users/admin/:id', async(req,res) =>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const updateDoc = {
      $set: {
        role: 'Admin'
      }
    }
    const result = await userCollection.updateOne(filter, updateDoc)
    res.send(result)
  })

  //  cart added here 
  app.post('/carts', async(req, res) => {
    const cartItem = req.body;
    const result = await cartsCollection.insertOne(cartItem)
    res.send(result)
  })
  app.get('/carts', async(req, res) => {
    const query = req.query;
    const result = await cartsCollection.find(query).toArray()
    res.send(result)
  })
   app.get('/menu', async(req, res) => {
    const result = await menuCollection.find().toArray()
    res.send(result)
   })
   app.get('/reviews', async(req, res) => {
    const result = await reviewsCollection.find().toArray()
    res.send(result)
   })
   app.delete('/carts/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id : new ObjectId(id)}
    const result = await cartsCollection.deleteOne(query)
    res.send(result)
   })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', async(req, res) => {
    res.send('Restaurant Boss is running...')
})

app.listen(port, () => {
    console.log(`Restaurant Boss is Running on port ${port}`);
})