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

const workItemSchema = new Schema({
  name: {
    type: String,
    required: [true, "list mustn't be empty"],
  },
});

const workItem = mongoose.model("workItem", workItemSchema);

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
        } else {
          res.render("list", {
            title: day,
            ListTitle: "Welcome To Your TodoLists!",
            items: result,
          });
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("Internal Server Error");
      }
    });
app.post("/", async (req, res) => {
      const itemgen = req.body.item;
      const listwork = req.body.list;

      try {
        if (listwork === "Work") {
          const workItemDoc = new workItem({ name: itemgen });
          await workItemDoc.save();
          res.redirect("/work");
        } else {
          const generalItemDoc = new generalItem({ name: itemgen });
          await generalItemDoc.save();
          res.redirect("/");
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/work", async (req, res) => {
      const day = getDate();

      try {
        const workresult = await workItem.find({});
        if (workresult.length === 0) {
          await workItem.create({ name: "Add your worklists here" });
          res.redirect("/work");
        } else {
          res.render("list", {
            title: day,
            ListTitle: "Work List",
            items: workresult,
          });
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("Internal Server Error");
      }
    });
    app.post("/work", (req, res) => {
      const itemwork = req.body.item;
      try {
        const workItems = new workItem({
          name: itemwork,
        });
        workItems.save();
        res.redirect("/work");
      } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/edit", async (req, res) => {
      const { id, list } = req.body;
      let itemToEdit;
      let listName;

      try {
        if (list === "Work") {
          itemToEdit = await workItem.findById(id);
          listName = "Work";
        } else {
          itemToEdit = await generalItem.findById(id);
          listName = "Home";
        }

        if (itemToEdit) {
          res.render("edit", { item: itemToEdit, listName });
        } else {
          res.redirect("/");
        }
      } catch (err) {
        console.error("Error fetching item:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/update", async (req, res) => {
      const { id, list, updatedName } = req.body;

      try {
        if (list === "Work") {
          await workItem.findByIdAndUpdate(id, { name: updatedName });
          res.redirect("/work");
        } else {
          await generalItem.findByIdAndUpdate(id, { name: updatedName });
          res.redirect("/");
        }
      } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).send("Internal Server Error");
      }
    });
    app.post("/delete", async (req, res) => {
      const { id, list } = req.body;

      try {
        if (list === "Work") {
          await workItem.findByIdAndDelete(id);
          res.redirect("/work");
        } else {
          await generalItem.findByIdAndDelete(id);
          res.redirect("/");
        }
      } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
