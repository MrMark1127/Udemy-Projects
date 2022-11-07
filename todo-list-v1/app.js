const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const _ = require("lodash")

const port = process.env.PORT || 3001;

const app = express()


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb+srv://Mark1127:<password>@cluster0.pwkzxza.mongodb.net/todolistDB")

const itemsSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, "Check data entry, a name is required for the item."]
    }
})

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item ({
    name: "Welcome to the ToDo List"
})
const item2 = new Item ({
    name: "Hit + to add a new item!"
})
const item3 = new Item ({
    name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

app.get("/", function(req, res){

    Item.find({}, function(err, foundItems){
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Added 3 new item documents.")
                }
            })
            res.redirect("/")
        } else {
            res.render('list', {listTitle: "Today", listItems: foundItems})
        }
    })    
})

app.post("/", function(req, res){
    const newListItem = req.body.listItem
    const listName = req.body.list

    const newItem = new Item({
        name:newListItem
    })

    if (listName === "Today") {
        newItem.save()
        res.redirect("/")
    } else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(newItem)
            foundList.save()
            res.redirect(`/${listName}`)
        })
    }
})

app.post("/delete", function(req, res) {
    const checkedItemID = req.body.checkbox
    const listName = req.body.listName

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemID, function(err){
            if (err) {
                console.log(err)
            } else {
                console.log(`Successfully deleted ID: ${checkedItemID}`)
            }
        })
        res.redirect("/")
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}, function(err, foundList){
            if (!err) {
                res.redirect(`/${listName}`)
            }
        })
    }
})

app.get("/:customListName", function(req,res) {
    const customListName = _.capitalize(req.params.customListName)

    List.findOne({name: customListName}, function(err, foundList) {
        if(!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect(`/${customListName}`)
            } else {
                res.render("list", {listTitle: customListName, listItems: foundList.items})
            }
        }
    })
})

app.get("/about", function(req, res){
    res.render("about")
})

app.listen(port, function(){
    console.log("Started Server on Port " + port)
})
