import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getDate } from "./date.js";
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
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
  defaultItem: {
    type: Boolean,
    default: false,
  },
});
const GeneralItem = mongoose.model("GeneralItem", generalItemSchema);

const listItemSchema = new Schema({
  name: {
    type: String,
    required: [true, "list item mustn't be empty"],
  },
});
const ListItem = mongoose.model("ListItem", listItemSchema);

const listSchema = new Schema({
  name: {
    type: String,
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "ListItem" }],
});
const List = mongoose.model("List", listSchema);

async function main() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB!");

    app.get("/", async (req, res) => {
      const day = getDate();

      try {
        const result = await GeneralItem.find({});

        if (result.length === 0) {
          await GeneralItem.insertMany([
            {
              name: "Click the add button to add items to your lists",
              defaultItem: true,
            },
          ]);
          return res.redirect("/");
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

    const reservedRoutes = ["favicon.ico", "edit", "update", "delete"];

    app.get("/:customname", async (req, res) => {
      const customname = req.params.customname;

      if (reservedRoutes.includes(customname.toLowerCase())) {
        return res.status(204).end();
      }
      try {
        const listresult = await List.findOne({ name: customname })
          .populate("items")
          .exec();
        const results = await GeneralItem.find({ defaultItem: true });
        if (!listresult) {
          const lists = new List({
            name: customname,
            items: results.map((item) => item._id),
          });
          await lists.save();
          return res.redirect(`/${customname}`);
        } else {
          res.render("list", {
            title: getDate(),
            ListTitle: listresult.name + " list",
            items: listresult.items,
          });
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/", async (req, res) => {
      const itemgen = req.body.item;
      const listname = req.body.list;

      try {
        if (listname === "Welcome To Your TodoLists!") {
          await GeneralItem.create({ name: itemgen });
          res.redirect("/");
        } else {
          const newItem = new ListItem({ name: itemgen });
          await newItem.save();
          const foundList = await List.findOne({ name: listname });
          if (foundList) {
            foundList.items.push(newItem._id);
            await foundList.save();
            res.redirect("/" + listname);
          } else {
            res.status(404).send("List not found");
          }
        }
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
        if (list === "Welcome To Your TodoLists!") {
          itemToEdit = await GeneralItem.findById(id);
          listName = "Welcome To Your TodoLists!";
        } else {
          itemToEdit = await ListItem.findById(id);
          listName = list;
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
        if (list === "Welcome To Your TodoLists!") {
          await GeneralItem.findByIdAndUpdate(id, { name: updatedName });
          res.redirect("/");
        } else {
          await ListItem.findByIdAndUpdate(id, { name: updatedName });
          res.redirect("/" + list);
        }
      } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/delete", async (req, res) => {
      const { id, list } = req.body;

      try {
        if (list === "Welcome To Your TodoLists!") {
          await GeneralItem.findByIdAndDelete(id);
          res.redirect("/");
        } else {
          await ListItem.findByIdAndDelete(id);
          await List.updateMany({}, { $pull: { items: id } });
          await List.deleteMany({ items: { $size: 0 } });
          res.redirect("/" + list);
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
