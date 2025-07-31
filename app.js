import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getDate } from "./date.js";
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import { log } from "console";
import { title } from "process";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${user}:${password}@clusterprocti.8xcgpwj.mongodb.net/Todolist-db?retryWrites=true&w=majority&appName=Clusterprocti`;

const generalItemSchema = new Schema({
  name: {
    type: String,
    required: [true, "list mustn't be empty"],
  },
});

const generalItem = mongoose.model("generalItem", generalItemSchema);

// const workItemSchema = new Schema({
//   name: {
//     type: String,
//     required: [true, "list mustn't be empty"],
//   },
// });

// const workItem = mongoose.model("workItem", workItemSchema);

async function main() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB!");

    app.get("/", async (req, res) => {
      const day = getDate();

      try {
        const result = await generalItem.find({});
        if (result.length === 0) {
          await generalItem.create({ name: "Add your lists here" });
          res.redirect("/");
        }else {
          res.render("list", {
          title: "Welcome To Your TodoLists!",
          ListTitle: day,
          items: result,
        });
        }

        
      } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("Internal Server Error");
      }
    });
  } 
  catch (err) {
    console.error("Error:", err);
  }
}
main();

let generalItems = [];
let workItems = [];



  

  


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
  const item = req.body.item;
  const newItem = {
    id: Date.now().toString(),
    name: item,
  };
  workItems.push(newItem);
  res.redirect("/work");
});

app.post("/edit", (req, res) => {
  const { id, list } = req.body;
  let itemToEdit;
  let listName;

  if (list === "Work") {
    itemToEdit = workItems.find((item) => item.id === id);
    listName = "Work";
  } else {
    itemToEdit = generalItems.find((item) => item.id === id);
    listName = "Home";
  }

  if (itemToEdit) {
    res.render("edit", { item: itemToEdit, listName });
  } else {
    res.redirect("/");
  }
});

app.post("/update", (req, res) => {
  const { id, list, updatedName } = req.body;

  if (list === "Work") {
    workItems = workItems.map((item) => {
      if (item.id === id) {
        return { ...item, name: updatedName };
      }
      return item;
    });
    res.redirect("/work");
  } else {
    generalItems = generalItems.map((item) => {
      if (item.id === id) {
        return { ...item, name: updatedName };
      }
      return item;
    });
    res.redirect("/");
  }
});

app.post("/delete", (req, res) => {
  const { id, list } = req.body;

  if (list === "Work") {
    workItems = workItems.filter((item) => item.id !== id);
    res.redirect("/work");
  } else {
    generalItems = generalItems.filter((item) => item.id !== id);
    res.redirect("/");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
