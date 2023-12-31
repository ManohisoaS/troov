var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });
var userRouter = require("./routes/user");
var objectRouter = require("./routes/object");
var notFoundController = require("./controllers/notFound");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/", objectRouter);
app.use(notFoundController);

module.exports = app;
