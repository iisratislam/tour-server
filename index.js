const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vldbw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kk00x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
      try {
            await client.connect();
            const database = client.db('tour');
            const servicesCollection = database.collection('services');
            const packagesCollection = database.collection('packages');

            //GET API

            app.get('/services', async (req, res) => {
              const cursor = servicesCollection.find({});
              const services = await cursor.toArray();
              res.send(services);
            })
            app.get('/packages', async (req, res) => {
              const cursor = packagesCollection.find({});
              const packages = await cursor.toArray();
              res.send(packages);
            })

            //post Api
            app.post('/services', async (req, res) =>{
                  const service =req.body;
                  console.log('hit the post', service);
                  const result = await servicesCollection.insertOne(service);
                  console.log(result);
                  res.json(result)
            });

            //DELETE API
            app.delete('/services/:id', async(req, res) =>{
                  const id = req.params.id;
                  const query = {_id:ObjectId(id)};
                  const result = await servicesCollection.deleteOne(query);
                  res.json(result);
            })



             
    }
      finally {
            // await client.close()
      }
}
run().catch(console.dir);

app.get('/', (req, res) => {
      res.send("hello form the server side");
})

app.listen(port, () => {
      console.log('port is running at', port);
})