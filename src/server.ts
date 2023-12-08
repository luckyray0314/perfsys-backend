import express, { Express } from "express";
import cors from "cors";

import user from "./routes/api/user";
import order from "./routes/api/order";
import factory from "./routes/api/factory";
import customer from "./routes/api/customer";
import owner from "./routes/api/owner";
import satistics from "./routes/api/satistics";
import connectDB from "./lib/dbConnect";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();
const port: Number = process.env.PORT ? Number(process.env.PORT) : 5000;

const path = require("path");

connectDB();
app.set("trust proxy", true);

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/static", express.static(__dirname + "/public"));

app.use("/api/user", user);
app.use("/api/order", order);
app.use("/api/factory", factory);
app.use("/api/customer", customer);
app.use("/api/owner", owner);
app.use("/api/satistics", satistics);
app.get("/api/get-suv-version", (req, res) => {
  res.send(
    JSON.stringify({
      version: "1.0.0",
      file: "suv-1.0.0.zip",
      update_at: "2023-06-14",
    })
  );
});

if (process.env.ENVIRONMENT === "PRODUCTION") {
  console.log("Production requested");
  app.use(express.static(path.join(__dirname, "build", "index.html")));

  app.get("/*", async (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
