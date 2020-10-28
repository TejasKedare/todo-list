const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const itemSchema = {
  name: {
    type: String,
  },
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todolist",
});

const item2 = new Item({
  name: "Hit the + button to add a new item",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item",
});

const defaultItem = [item1, item2, item3];

const listScheme = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listScheme);

app.get("/", (req, res) => {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let currentDay = today.toLocaleDateString("hi-IN", options);

  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItem, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("data has been inserted");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: currentDay, foundItems: foundItems });
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkedItem = req.body.checkbox;
  Item.findByIdAndRemove(checkedItem, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("successfuly deleted");
      res.redirect("/");
    }
  });
});

app.get("/:list", (req, res) => {
  const customListName = req.params.list;
  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // create a new list
        const list = new List({
          name: customListName,
          items: defaultItem,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        // show an existing list
        res.render("list", {
          listTitle: foundList.name,
          foundItems: foundList.items,
        });
      }
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => console.log("server is running on port 3000"));
