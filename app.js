const express = require("express");
const path = require("path");
const date = require(path.join(__dirname, "date.js"));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

let generalItems = [];
let workItems = [];


app.get("/", (req, res) => {
  const day = date();
  res.render("list", {
    ListTitle: day,
    items: generalItems,
  });
});

app.post("/", (req, res) => {
  const item = req.body.item;
  const list = req.body.list;

  const newItem = {
    id: Date.now().toString(), 
    name: item,
  };

  if (list === "Work") {
    workItems.push(newItem);
    res.redirect("/work");
  } else {
    generalItems.push(newItem);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", {
    ListTitle: "Work List",
    items: workItems,
  });
});

app.post("/work", (req, res) => {
  let newitem = req.body.item;
  workitems.push(newitem);
  res.redirect("/work");
});

app.post("/edit", (req, res) => {
  const { id, list } = req.body;

  const items = list === "Work" ? workItems : generalItems;
  const itemToEdit = items.find(item => item.id === id);

  if (!itemToEdit) {
    return res.status(404).send("Item not found");
  }

  res.render("edit", {
    item: itemToEdit,
    listName: list
  });
});



app.post("/update", (req, res) => {
  const { id, list, updatedName } = req.body;

  let itemsArray = list === "Work" ? workItems : generalItems;

  const index = itemsArray.findIndex(item => item.id === id);

  if (index !== -1) {
    itemsArray[index].name = updatedName;
  }

  res.redirect(list === "Work" ? "/work" : "/");
});


app.post("/delete", (req, res) => {
  const { id, list } = req.body;

  if (list === "Work") {
    workItems = workItems.filter(item => item.id !== id);
    res.redirect("/work");
  } else {
    generalItems = generalItems.filter(item => item.id !== id);
    res.redirect("/");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
