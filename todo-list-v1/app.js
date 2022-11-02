const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + '/date.js')

const app = express()

const newListItems = ["Buy food", "Cook Food", "Eat Food"]
const workItems = []

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.get("/", function(req, res){
    let day = date.getDate()
    res.render('list', {listTitle: day, listItems: newListItems})
})

app.post("/", function(req, res){

    newListItem = req.body.listItem

    if (req.body.list === "Work") {
        workItems.push(newListItem)
        res.redirect("/work")
    } else {
        newListItems.push(newListItem)
        res.redirect("/")
    }
})

app.get("/work", function(req, res){
    res.render('list', {listTitle: "Work List", listItems: workItems})
})

app.post("/work", function(req, res){
    let item = req.body.newItem
    workItems.push(item)
    res.redirect("/work")
})

app.get("/about", function(req, res){
    res.render("about")
})

app.listen(3001, function(){
    console.log("Started Server on Port 3001.")
})