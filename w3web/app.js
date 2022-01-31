const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyparser = require('body-parser')
const path = require('path')
const port = process.env.PORT || 3000

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.json())



mongoose.connect('mongodb://localhost:27017/lab3web',{
    useNewURLParser:true
}).then(()=>{
    console.log("Connected to Database")
}).catch((err)=>{
    console.log(err)
})
require('./models/Empl')

var Empl = mongoose.model('empl')

//saves the data
app.post('/saveEmpl', (req,res)=>{
    console.log(req.body)

    //create new entry for food
    new Empl(req.body).save().then(()=>{
        console.log("Data Saved")
        res.redirect("view.html")
    })
})

app.get('/getData', (req,res)=>{
    Empl.find().then((empl)=>{
        res.json({empl})
    })
})

//delete the data
app.post('/deleteEmpl', (req,res)=>{
    console.log("Employee deleted " + req.body._id + " " + req.body.empl)
    Empl.findByIdAndDelete(req.body._id).exec()
    res.redirect("delete.html")
    document.write("<h1>Employee deleted " + req.body._id + " " + req.body.fname + "</h1>")
    
})

app.post('/updateEmpl', (req,res)=>{
    console.log("Employee updated " + req.body._id + " " + req.body.empl)
    Empl.findByIdAndUpdate(req.body._id).exec()
    res.redirect("view.html")
    document.write("<h1>Employee updated " + req.body._id + " " + req.body.fname + "</h1>")
    
})

app.use(express.static(__dirname+"/views"))
app.listen(port,()=>{
    console.log('listening on port 3000')
})
