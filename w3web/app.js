const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyparser = require('body-parser')
const { Router } = require('express')
const {ObjectId} = require('mongodb')
const moment = require('moment')
const port = process.nextTick.PORT || 3000
const exphbs = require('express-handlebars')

app.engine("hbs",exphbs.engine({
    defaultLayout:"main",
    extname:".hbs",
    helpers:{
        getShortComment(comment){
            if(comment.length < 60){
                return comment
            }
            return comment.substring(0,60)+'...'
        },
        dateFormat(startDate){
            return moment(startDate).format('YYYY-MM-DD').toString(); //04-05-2017
        }
    }
}))
app.set('view engine', 'hbs')

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

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/view', (req, res) => {
    res.render('view');
});

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

app.get('/update/:id', (req,res,next)=>{
    console.log(req.params.id)
    Empl.findById({_id: ObjectId(req.params.id)}, req.body, {new:true}, (err, docs)=>{
        if(err){
            console.log("Can't retrieve the data")
            next(err)
        }else{
            res.render('update', docs)
        }
    })
})

app.post('/update/:id', (req, res, next)=> {
    Empl.findByIdAndUpdate({_id: ObjectId(req.params.id)}, req.body, (err,docs)=>{
        if(err){
            console.log("Something went wrong.")
        }else{
            res.redirect('../view')
        }
    })
})

app.use(express.static(__dirname+"/views"))
app.listen(port,()=>{
    console.log('listening on port 3000')
})
