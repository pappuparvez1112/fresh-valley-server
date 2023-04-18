const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors');
const bodyParser=require('body-parser');
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;

const port = process.env.PORT || 5500;
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p4mie.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
     try{
      const productCollection = client.db("freshValley").collection("products");
      const ordersCollection = client.db("freshValley").collection("orders");
      console.log('connected');


      app.get('/products',async(req,res)=>{
        
        const query={};
        const cursor = productCollection.find(query);
        const products=await cursor.toArray();
        res.send(products);

      });

      app.get('/products/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const products=await productCollection.findOne(query);
        res.send(products);

       
      });

      app.get('/orders',async(req,res)=>{

        const query={};
        const cursor = ordersCollection.find(query);
        const orders=await cursor.toArray();
        res.send(orders);
        console.log('from database',orders);
        // ordersCollection.find({})
        // .toArray((err,items)=>{
        //   res.send(items);
        //   // console.log('from database',items)
        // })
      });

        app.get('/orders/:email',async (req,res)=>{
        const email=req.params.email;
        const cursor= ordersCollection.find({userEmail:email});
        const orders=await cursor.toArray();
        res.send(orders);
        }) 


      // app.get('/orders', async (req, res) => {
      //   const postId = req.query.postId;
      //   const userEmail = req.query.userEmail;
    
      //   let query = {};
      //   if (postId) {
      //       query = { post_id: postId };
      //   }
      //   if (userEmail) {
      //       query = {
      //           userEmail
      //       };
      //   }
      //   const cursor = ordersCollection.find(query);
      //   const orders = await cursor.toArray();
      //   res.send(orders);
      //  });

        // app.post('/addProduct',(req,res)=>{
  //   const newProduct=req.body;
  //   console.log('adding product',newProduct);
  //   productcollection.insertOne(newProduct)
  //   .then(result=>{
  //     console.log('inserted count',result.insertedCount);
  //     res.send(result.insertedCount>0)
  //   })
  // })


       app.post('/addProduct', async (req, res) => {
        const newProduct = req.body;
        console.log('adding product',newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result.insertedCount>0);
       });

    

      app.post('/addOrder',async (req,res)=>{
        const orders=req.body;
        
        const result=await ordersCollection.insertOne(orders);
        res.send(result.insertedCount);
      });

      app.delete('/deleteOrder/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await ordersCollection.deleteOne(query);
        console.log(result);
        res.send(result);
    });
      
    



     }finally{

     }
 
  
  // perform actions on the collection object
  // client.close();



  // app.get('/products/:id',(req,res)=>{
  //   const id=req.params.id;
  //   productcollection.find({_id:ObjectID(id)})
  //   .toArray((err,items)=>{
  //     res.send(items[0])
  //     // console.log('from database',items)
  //   })
  // })   

  // app.post('/addOrder',(req,res)=>{
  //   const orders=req.body;
    
  //   orderscollection.insertOne(orders,(err,result)=>{
  //     console.log('inserted count',result.insertedCount);
  //     res.send({count:result.insertedCount});
  //   })
  // })

  
  // app.get('/orders',(req,res)=>{
  //   orderscollection.find({})
  //   .toArray((err,items)=>{
  //     res.send(items);
  //     // console.log('from database',items)
  //   })
  // }) 

  // app.get('/orders/:email',(req,res)=>{
  //   const email=req.params.email;
  //   orderscollection.find({userEmail:email})
  //   .toArray((err,items)=>{
  //     res.send(items);
  //     // console.log('from database',items)
  //   })
  // }) 
  
//   app.get('/orders', async (req, res) => {
//     const postId = req.query.postId;
//     const userEmail = req.query.userEmail;

//     let query = {};
//     if (postId) {
//         query = { post_id: postId };
//     }
//     if (userEmail) {
//         query = {
//             userEmail
//         };
//     }
//     const cursor = ordersCollection.find(query);
//     const reviews = await cursor.toArray();
//     res.send(reviews);
// });

  

  

  // app.post('/addProduct',(req,res)=>{
  //   const newProduct=req.body;
  //   console.log('adding product',newProduct);
  //   productcollection.insertOne(newProduct)
  //   .then(result=>{
  //     console.log('inserted count',result.insertedCount);
  //     res.send(result.insertedCount>0)
  //   })
  // })

  // app.delete('/deleteorder/:id',(req,res)=>{
  //   const id=req.params.id;
  //   orderscollection.deleteOne({_id:ObjectID(id)},(err)=>{
  //     if(!err){
  //       res.send({count:1})
  //     }
  //   })
  // })
};

run().catch(error=>console.error(error))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})