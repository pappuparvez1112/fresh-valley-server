const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors=require('cors');
const bodyParser=require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5500;
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p4mie.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
     console.log('connection err',err)
  const productcollection = client.db("freshValley").collection("products");
  console.log('connected');
  // perform actions on the collection object
  // client.close();

  app.get('/products',(req,res)=>{
    productcollection.find()
    .toArray((err,items)=>{
      res.send(items)
      // console.log('from database',items)
    })
  })  

  app.post('/addProduct',(req,res)=>{
    const newProduct=req.body;
    console.log('adding product',newProduct);
    productcollection.insertOne(newProduct)
    .then(result=>{
      console.log('inserted count',result.insertedCount);
      res.send(result.insertedCount>0)
    })
  })
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})