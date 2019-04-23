const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");

const mongoose = require("mongoose");

const schema = require("./graphql/schema/index");
const root = require("./graphql/resolvers/index");
const { authMW } = require("./utils/middlewares");

const app = express();
app.use(bodyParser.json());

//CORS configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(authMW);

app.use(
  "/graphql",
  graphqlHttp({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("database connected");
    app.listen(4200, () => {
      console.log("server is running");
    });
  })
  .catch(err => console.log(err));
