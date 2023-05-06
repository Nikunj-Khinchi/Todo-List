
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/todo",
    { useUnifiedTopology: true },
    { useCreateIndex: true }
  )
  .then(() => {
    console.log("Connect Succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todoList",
});

const item2 = new Item({
  name: "Hit the + button to add a new item. ",
});
const item3 = new Item({
  name: " <— Hit this to delete an item. ",
});

const defultItems = [item1, item2, item3];

const listSchema = {
  name : String,
  item: [itemsSchema]
}

const List = mongoose.model("List" , listSchema);

app.get("/", function (req, res) {
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defultItems)
          .then(() => {
            console.log("Succesfully Saved default items to DB");
          })
          .catch((err) => {
            console.log(err);
          });
          res.redirect("/");
      }else{
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");  
});

app.post("/delete", (req,res)=>{
  console.log(req.body.checkBox);
  const checkedItemID = req.body.checkBox;

  Item.findByIdAndRemove(checkedItemID).then(()=>{
     console.log("Succesfully deleted the checked item");
     res.redirect("/")
  }).catch((err)=>{
    console.log(err);
  })
})

app.get("/:customListName", function (req, res) {
  const customListName  = req.params.customListName;

  List.findOne({name: customListName}).then((foundlist)=>{
     if(!foundlist){
      const list = new List({
        name:customListName,
        items: defultItems
      })
    
      list.save();
    res.redirect("/"+  customListName);
     }else{ 
      res.render("list", { listTitle: foundlist.name, newListItems: foundlist.item })
     }
  }).catch((err)=>{
    console.log(err);
  })
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItems.push(item);

  res.redirect("/work");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
