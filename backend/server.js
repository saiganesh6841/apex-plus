const jsonServer = require('json-server')
const express = require('express')
const cors=require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

app.use("/api",middlewares,router)

app.get("/",(req,res)=>{
  res.send("the server is successfully running")
})

const port = 5000;
app.listen( port, () => {
  console.log('JSON Server is running on ' +port)
})