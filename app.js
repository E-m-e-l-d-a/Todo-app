const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js")

const app = express();
app.set("view engine", "ejs");

let list = [];
let workitems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  let day = date();
  res.render("list", { ListTitle: day, next: list });
});

app.post("/", (req, res) => {
  let newitem = req.body.item;

  if (req.body.list === "Work"){
    workitems.push(newitem);
    res.redirect("/work");
  } else {
    list.push(newitem);
    res.redirect("/");
  }
});

app.get("/work", (req,res) => {
  res.render("list",{ListTitle: "Work List", next: workitems})
})

app.post("/work", (req, res) => {
  let newitem = req.body.item;
  workitems.push(newitem);
  res.redirect("/work");
});

app.post("/delete", (req, res) => {
  const itemToDelete = req.body.item;

  if (req.body.list === "Work"){
    workitems = workitems.filter((workitem) => workitem !== itemToDelete);
    res.redirect("/work");
  } else {
    list = list.filter((item) => item !== itemToDelete);
    res.redirect("/");
  }
  
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
