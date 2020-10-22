const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.get("/", (req, res) => {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let currentDay = today.toLocaleDateString("hi-IN", options);

  res.render("list", { listTitle: currentDay, newListItems: items });
});

app.post("/", (req, res) => {
  let item = req.body.newItem;
  if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", (req, res) => {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => console.log("server is running on port 3000"));
