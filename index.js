require('dotenv').config();
const express = require('express')
const app = express()
const cors=require('cors')
app.use(cors())
app.use(express.json())
const port =process.env.PORT|| 3000

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.mq5kn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db("insertDB").collection("review");
    const likedreview = client.db("insertDB").collection("liked");
    const userscollection = client.db("insertDB").collection("users");
    const eventcollection = client.db("insertDB").collection("event");
    const likedGames = client.db("insertDB").collection("games");

//add review 
app.post('/addreview',async(req,res)=>{
    const newreview=req.body
    console.log(newreview);
    const result=await database.insertOne(newreview)
    res.send(result)
})

//add userInfo
app.post('/adduser',async(req,res)=>{
    const newuser=req.body
    console.log(newuser);
    const result=await userscollection.insertOne(newuser)
    res.send(result)
})

//add eventInfo
app.post('/addevent',async(req,res)=>{
    const newevent=req.body
    console.log(newevent);
    const result=await eventcollection.insertOne(newevent)
    res.send(result)
})
//add moreLike GAmes
app.post('/liked/games',async(req,res)=>{
    const newgames=req.body
    console.log(newgames);
    const result=await likedGames.insertOne(newgames)
    res.send(result)
})
//add favorite review 
app.post('/liked/review',async(req,res)=>{
    const newreview=req.body
    console.log(newreview);
    const result=await likedreview.insertOne(newreview)
    res.send(result)
})
//get favorite review 
app.get('/liked/review',async(req,res)=>{

    const result=await likedreview.find().toArray()
    res.send(result)
})
//get more like games 
app.get('/liked/games',async(req,res)=>{

    const result=await likedGames.find().toArray()
    res.send(result)
})
//get review
app.get('/addreview',async(req,res)=>{
    const result=await database.find().toArray()
    res.send(result)
})
//get review as  categori
app.get('/addreview/:genreslist',async(req,res)=>{
  const genreslist=req.params.genreslist
  const query={genreslist:genreslist}
    const result=await database.find(query).toArray()
    res.send(result)
})
//

//get event
app.get('/addevent',async(req,res)=>{
    const result=await eventcollection.find().toArray()

    res.send(result)
})
//delete event
app.delete('/deletevent/:id',async(req,res)=>{
const id=req.params.id
const query = { _id:new ObjectId(id)};
const result = await eventcollection.deleteOne(query);
res.send(result)
})

//get users
app.get('/adduser',async(req,res)=>{
    const result=await userscollection.find().toArray()
    res.send(result)
})
//get single email
app.get('/adduser/:email',async(req,res)=>{
  const email=req.params.email
const query = {email};
const result = await userscollection.findOne(query);
res.send(result)
})
//get single email for favorite 
app.get('/liked/review/:email',async(req,res)=>{
  const email=req.params.email
  const query = { myemail: { $regex: email, $options: "i" } };
  const result = await likedreview.find(query).toArray();
res.send(result)
})
// //get review as  mail 
app.get('/addreview/:email',async(req,res)=>{
  const email=req.params.email
  const query = { useremail: { $regex: email, $options: "i" } };
  const result = await database.find(query).toArray();
res.send(result)
})
//delete revied
//delete event
app.delete('/deletreview/:id',async(req,res)=>{
  const id=req.params.id
  const query = { _id:new ObjectId(id)};
  const result = await database.deleteOne(query);
  res.send(result)
  })

//show details as id
app.get('/revdetails/:id',async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const result=await database.findOne(query)
  res.send(result)
})
//show event as id
app.get('/addevent/:id',async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const result=await eventcollection.findOne(query)
  res.send(result)
})
//update event 
app.put('/addevent/:id',async(req,res)=>{
  const id=req.params.id

  const updateEvet=req.body
  const options = { upsert: true };
  const query={_id:new ObjectId(id)}
  const updateEvent = {
    $set: {
      
      link:updateEvet.link,
      cover:updateEvet.cover,
      price:updateEvet.price,
      title:updateEvet.title,
      review:updateEvet.review,
      relisedate: updateEvet.relisedate,
      addTime: updateEvet.addTime,
  }}
  const result = await eventcollection.updateOne(query, updateEvent, options);
  res.send(result)
})
//update user review 
app.put('/revdetails/:id',async(req,res)=>{
  const id=req.params.id
   const getreview=req.body
   const query={_id:new ObjectId(id)}
   const options = { upsert: true };
   const updateReview = {
    $set: {
     cover:getreview.cover,
       title:getreview.title,
      review:getreview.review,
     rating:getreview.rating,
     year:getreview.year,
     genreslist:getreview.genreslist
    },
  };
  const result = await database.updateOne(query, updateReview, options);
  res.send(result)
})

  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})