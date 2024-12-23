import express from 'express'
const app = express();
import dotenv from 'dotenv'
dotenv.config()

import '../db/index.js'//database connection

app.get('/', (req, res)=>{
    res.send("Welcome to my application!!")
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("App is running on port: ", port)
})