const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const http = require('http').createServer(app)
const fs = require("fs")



mongoose.connect('mongodb+srv://Pedro:MLPD31415pi@cluster1.y3fif13.mongodb.net/carpepiso')
const db = mongoose.connection
db.once('open', () => {
    console.log('connected mongodb')
})
db.on('error', console.error.bind(console, 'error'))
 
app.use(express.static(path.join(__dirname , "views")))

const expressFormidable = require('express-formidable')
app.use(expressFormidable())

const mongodb  = require("mongodb")
const mongoClient = mongodb.MongoClient

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
http.listen(process.env.PORT || 4000, async function (){

const client = await mongoClient.connect('mongodb+srv://Pedro:MLPD31415pi@cluster1.y3fif13.mongodb.net/')
 
const db1 = client.db("carpepiso")
app.locals.db = db1
app.locals.bucket = new mongodb.GridFSBucket(db1)
bucket = new mongodb.GridFSBucket(db1)
app.post("/home", function (request, result) {
    // get input name="file" from client side
    const file = request.files.file
    
    // set file path in MongoDB GriDFS
    // this will be saved as "filename" in "fs.files" collection
    const filePath = (new Date().getTime()) + "-" + file.name
    
    // read user uploaded file stream
    fs.createReadStream(file.path)
    
      // add GridFS bucket stream to the pipe
      // it will keep reading and saving file
      .pipe(
        bucket.openUploadStream(filePath, {
          // maximum size for each chunk (in bytes)
          chunkSizeBytes: 1048576, // 1048576 = 1 MB
          // metadata of the file
          metadata: {
            name: file.name, // file name
            size: file.size, // file size (in bytes)
            type: file.type // type of file
          }
        })
      )
      // this callback will be called when the file is done saving
      .on("finish", function () {
        result.send("File saved.")
      })

  })
  



app.get('/home', async function(req,res){
    /*const users = await models.find()*/
   
    
 
   
  
    res.render('index.ejs')
     
        /*users*/
    
    

})
  
 
   /* app.get("/image/:filename", async function (request, result) {
        // get file name from URL
        
        const filename = request.params.filename
        
        // get file from GridFS bucket
        const files = await bucket.find({
          filename: filename
        })
        .toArray()
        
        // return error if file not found
        if (!files || files.length == 0) {
          return result.status(404).json({
            error: "File does not exists."
          })
        }
     
        // it will fetch the file from bucket and add it to pipe
        // result response is added in the pipe so it will keep
        // returning data to the client
        bucket.openDownloadStreamByName(filename)
          .pipe(result)
  })
})

          
      */    
        

app.get("/image/index/:id/posit/:id2", async function (request, result) {
     const id = request.params.id
    const id2 = request.params.id2  

     try{  
       // get file from GridFS bucket
       
       const db = request.app.locals.db
       const files = await db.collection('fs.files').find({
         
          "metadata.index": id ,
          "metadata.pos" : id2
          
        })
        .toArray()
        
        
        
        // return error if file not found
        if (!files) {
          return result.status(404).json({
            error: "File does not exists."
          })
        }
      
      bucket.openDownloadStreamByName(files[0].filename)
   .pipe(result)
      }
      catch(err) {

      }
    
 

 })

    
      app.get("/image/index/", async function (request, result) {
    

     try{  
       // get file from GridFS bucket
       const bucket = request.app.locals.bucket
       const db = request.app.locals.db
       const files = await db.collection('fs.files').find({
         
          "metadata.index": "1"
         
          
        })
        .toArray()
        
        
        
        // return error if file not found
        if (!files) {
          return result.status(404).json({
            error: "File does not exists."
          })
        }
      
      bucket.openDownloadStreamByName(files[0].filename)
   .pipe(result)
      }
      catch(err) {

      }
    
 

 })
      
    
   /* app.get("/image/:filename", async function (request, result) {
        // get file name from URL
        const filename = request.params.filename
        
        // get file from GridFS bucket
        const files = await bucket.find({
          filename: filename
        })
        .toArray()
        
        // return error if file not found
        if (!files || files.length == 0) {
          return result.status(404).json({
            error: "File does not exists."
          })
        }
        
        // it will fetch the file from bucket and add it to pipe
        // result response is added in the pipe so it will keep
        // returning data to the client
        bucket.openDownloadStreamByName(filename)
          .pipe(result)
      })
    })*//*app.get("/filename/:index",async function (request, result) {
    
        // get file name from URL
       
        
        const index = request.params.index
        
        // get file from GridFS bucket
        const ind = await bucket.find({
          "metadata.index": index
        })
        .toArray()
        
        // return error if file not found
        if (!ind || ind.length == 0) {
          return result.status(404).json({
            error: "File does not exists."
          })
        }
        /*document.querySelectorAll(".p").forEach(p => {
           if ("3"=== p.id){
           bucket.openDownloadStream(ind._id)
          .pipe(result) 

           */


    
