// import dotenv from "dotenv"; //Experimental feature
// to use the above syntax of dotenv add the follwing in the package.json script.
// "scriptName":"nodemon -r dotenv/config --experimental-json-modules src/index.js"
// require("dotenv").config();
import app from "./app.js";
import config from "./config/config.js";
import connectDB from "./db/index.js";
import { DB_NAME } from "./constants.js";

connectDB(config.MONGO_URI, DB_NAME)
  .then(() => {
    //Start the server after DB is connected successfully
    app.listen(
      process.env.PORT || 8000,
      console.log(`Server started at http://localhost:${process.env.PORT}`),
    );
  })
  .catch((e) => {
    console.error(e);
  });
